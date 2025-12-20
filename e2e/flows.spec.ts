import { test, expect, type Page } from '@playwright/test';

// Helpers to mock API endpoints
const mockPricing = {
  categories: [
    { serviceCd: '001', serviceNm: '에어컨 케어 및 세척' },
    { serviceCd: '003', serviceNm: '상가/사무실 시공' },
  ],
  products: [
    {
      productNo: 'P-001',
      productNm: '스탠드형 에어컨 분해 세척',
      productDesc: '프리미엄 세척',
      salePrice: 120000,
      originalPrice: 150000,
      saleYn: 'Y',
      discountRate: 20,
      serviceTime: '2시간',
      serviceCd: '001',
      features: null,
      serviceIncludes: JSON.stringify(['분해 세척', '항균 코팅', '악취 제거'])
    },
  ],
};

const mockReviewsAll = {
  serviceCdList: [
    { serviceCd: '001', serviceNm: '에어컨 케어 및 세척' },
  ],
  data: [
    {
      serviceNm: '에어컨 케어 및 세척', reviewSeq: 'R-1', svcDate: '2024-11-01', dispYn: 'Y',
      serviceCd: '001', starRate: 5, reviewNm: '만족합니다', rgsDt: '2024-11-10', reviewCn: '꼼꼼해요'
    },
  ],
};

test.beforeEach(async ({ page }) => {
  // Mock APIs the UI may call
  await page.route('**/api/v1/category-products.do', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPricing) });
  });
  await page.route('**/api/v1/booking', async route => {
    const body = await route.request().postDataJSON().catch(() => ({}));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, bookingSeq: 'BK-1001', echo: body }) });
  });
  await page.route('**/api/inquiry', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.route('**/api/reviews/all', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockReviewsAll) });
  });
  await page.route('**/api/reviews', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.route('**/cnsltReg.do**', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isError: 'false' }) });
  });
});

async function scrollUntil(page: Page, predicate: () => Promise<boolean>, maxTries = 20) {
  for (let i = 0; i < maxTries; i++) {
    if (await predicate()) return true;
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
    await page.waitForTimeout(150);
  }
  return false;
}

test('자세히 보기 모달 동작', async ({ page }) => {
  await page.goto('/');
  await scrollUntil(page, async () => (await page.getByRole('button', { name: '자세히 보기' }).count()) > 0);
  await page.getByRole('button', { name: '자세히 보기' }).first().click();
  // 모달 오픈 시 body overflow hidden 적용 확인
  await expect.poll(async () => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
});

test('서비스 신청 플로우 성공', async ({ page }) => {
  await page.goto('/');
  // 홈클리닝 섹션이 렌더되도록 스크롤 후 서비스 신청 클릭
  await scrollUntil(page, async () => (await page.getByRole('button', { name: '서비스 신청' }).count()) > 0);
  await page.getByRole('button', { name: '서비스 신청' }).first().click();
  await page.getByPlaceholder('홍길동').fill('홍길동');
  await page.getByPlaceholder('010-1234-5678').fill('010-1234-5678');
  await page.getByRole('button', { name: /신청 완료|신청하기|제출/ }).click();
  await expect(page.getByText('신청 완료')).toBeVisible();
});

test('상담문의(전화) 링크 확인', async ({ page }) => {
  await page.goto('/');
  // 데스크탑 헤더: 표시 텍스트는 번호, 애니메이션 후 표시되므로 대기
  await scrollUntil(page, async () => (await page.locator('header').getByRole('link', { name: '1600-9762' }).count()) > 0, 5);
  const telLink = page.locator('header').getByRole('link', { name: '1600-9762' });
  await expect(telLink).toHaveAttribute('href', /tel:1600-9762/);
});

test('가격 확인하기 → 홈클리닝 스크롤 노출', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '가격 확인하기' }).click();
  // 홈클리닝 섹션 anchor가 존재하는지 확인
  await scrollUntil(page, async () => (await page.locator('#home-cleaning').count()) > 0);
  await expect(page.locator('#home-cleaning')).toBeVisible();
});

test('빠른문의 성공', async ({ page }) => {
  await page.goto('/');
  // Hero의 온라인 문의 버튼 클릭 → quick-inquiry로 스크롤됨
  await page.getByRole('button', { name: '온라인 문의' }).click();
  await scrollUntil(page, async () => (await page.getByPlaceholder('홍길동').count()) > 0);
  await page.getByPlaceholder('홍길동').fill('홍길동');
  await page.getByPlaceholder('010-1234-5678').fill('010-1234-5678');
  await page.getByPlaceholder('example@email.com').fill('test@example.com');
  await page.getByPlaceholder('문의하실 내용을 자세히 입력해주세요').fill('테스트 문의입니다.');
  await page.getByRole('button', { name: '문의 전송' }).click();
  await expect(page.getByText('문의가 접수되었습니다!')).toBeVisible();
});

test('후기 작성하기 플로우', async ({ page }) => {
  await page.goto('/');
  // 리뷰 섹션이 렌더되도록 스크롤
  await scrollUntil(page, async () => (await page.locator('#reviews').count()) > 0);
  // 기존 데이터 로딩 확인
  await expect(page.getByText('고객님들의 생생한 후기')).toBeVisible();
  // 후기 작성하기 버튼
  await page.getByRole('button', { name: '후기 작성하기' }).first().click();
  // 필드 채우기 (레이블/플레이스홀더 기반)
  await page.getByLabel('이름').fill('테스터');
  await page.getByLabel('비밀번호').fill('1234');
  // 서비스 선택 (Radix Select trigger)
  const reviewDialog = page.getByRole('dialog', { name: '후기 작성' });
  await reviewDialog.getByRole('combobox').first().click();
  await page.getByRole('option', { name: '에어컨 케어 및 세척' }).click();
  await page.getByLabel('서비스 날짜').fill('2024-12-01');
  await page.getByLabel('내용').fill('아주 좋아요');
  // 별점 5점 클릭 (lucide-star 아이콘) - 다이얼로그 내부로 한정
  await reviewDialog.locator('svg.lucide.lucide-star').nth(4).click();
  await page.getByRole('button', { name: '제출하기' }).click();
  // 다이얼로그 닫혔는지 또는 새로운 후기 반영 확인 (간단 검증)
  await expect(page.getByText(/테스터|아주 좋아요/)).toBeVisible();
});
