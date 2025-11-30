import { chromium } from '@playwright/test';

async function testBooking() {
  const browser = await chromium.launch({
    headless: false,  // 브라우저 UI를 보여줌
    slowMo: 500       // 각 동작을 천천히 실행
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🌐 페이지 로딩 중...');
    await page.goto('http://localhost:8003');
    await page.waitForLoadState('networkidle');

    console.log('✅ 페이지 로드 완료');

    // 페이지 하단까지 스크롤하여 모든 섹션 로드
    console.log('📍 페이지 스크롤 중...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // 가격 섹션으로 스크롤
    console.log('📍 가격 섹션으로 이동 중...');
    await page.evaluate(() => {
      const pricingSection = document.querySelector('#pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    await page.waitForTimeout(3000);

    // 데이터 로딩 대기
    console.log('⏳ 서비스 데이터 로딩 대기 중...');
    await page.waitForSelector('button:has-text("예약하기")', { timeout: 15000 });

    // "시스템 에어컨 청소" 또는 첫 번째 서비스 카드 찾기
    console.log('🔍 시스템 에어컨 청소 서비스 찾는 중...');

    // 모든 카드 찾기
    const cards = await page.locator('.group.relative.h-full').all();
    console.log(`📋 발견된 서비스 카드: ${cards.length}개`);

    let bookingButton = null;

    // 시스템 에어컨이 포함된 카드 찾기
    for (const card of cards) {
      const text = await card.textContent();
      console.log(`  - 카드 내용: ${text.substring(0, 50)}...`);

      if (text.includes('시스템') || text.includes('에어컨')) {
        console.log('✅ 시스템 에어컨 관련 서비스 카드 발견!');
        bookingButton = card.locator('button:has-text("예약하기")');
        break;
      }
    }

    // 찾지 못한 경우 첫 번째 카드 선택
    if (!bookingButton) {
      console.log('⚠️  시스템 에어컨 카드를 찾지 못했습니다. 첫 번째 서비스를 선택합니다.');
      if (cards.length > 0) {
        bookingButton = cards[0].locator('button:has-text("예약하기")');
      } else {
        bookingButton = page.locator('button:has-text("예약하기")').first();
      }
    }

    console.log('🖱️  예약하기 버튼 클릭...');
    await bookingButton.click();

    // 모달이 열릴 때까지 대기
    console.log('⏳ 예약 모달 대기 중...');
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    console.log('✅ 예약 모달 열림');

    await page.waitForTimeout(500);

    // 폼 데이터 입력
    console.log('📝 고객 정보 입력 중...');

    // 이름 입력
    await page.fill('input[name="name"]', '테스트고객');
    console.log('  ✓ 이름: 테스트고객');

    // 연락처 입력
    await page.fill('input[name="phone"]', '010-1234-5678');
    console.log('  ✓ 연락처: 010-1234-5678');

    // 이메일 입력
    await page.fill('input[name="email"]', 'test@example.com');
    console.log('  ✓ 이메일: test@example.com');

    await page.waitForTimeout(500);

    // 날짜 선택 - 내일 날짜 클릭
    console.log('📅 날짜 선택 중...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate();

    // 달력에서 내일 날짜 버튼 찾기
    const dayButtons = await page.locator('button[name="day"]').all();
    for (const button of dayButtons) {
      const isDisabled = await button.isDisabled();
      const text = await button.textContent();

      if (!isDisabled && text.trim() === String(tomorrowDay)) {
        await button.click();
        console.log(`  ✓ 날짜 선택: ${tomorrowDay}일`);
        break;
      }
    }

    await page.waitForTimeout(500);

    // 시간대 선택
    console.log('⏰ 시간대 선택 중...');
    await page.click('[role="combobox"]');
    await page.waitForTimeout(300);

    // 시간대 옵션에서 "10:00 - 11:00" 선택
    await page.click('text=10:00 - 11:00');
    console.log('  ✓ 시간대: 10:00 - 11:00');

    await page.waitForTimeout(500);

    // 추가 요청사항 입력
    console.log('💬 추가 요청사항 입력 중...');
    await page.fill('textarea[name="additionalRequests"]', 'Playwright 자동화 테스트입니다. 시스템 에어컨 청소를 원합니다.');
    console.log('  ✓ 추가 요청사항 입력 완료');

    await page.waitForTimeout(500);

    // 예약 신청하기 버튼 클릭
    console.log('🚀 예약 신청하기 버튼 클릭...');
    const submitButton = page.locator('button:has-text("예약 신청하기")');
    await submitButton.click();

    // 응답 대기 (성공 또는 실패 메시지)
    console.log('⏳ 서버 응답 대기 중...');

    // Toast 메시지 대기
    try {
      await page.waitForSelector('[data-sonner-toast]', { timeout: 10000 });

      // Toast 메시지 내용 읽기
      const toastText = await page.locator('[data-sonner-toast]').textContent();
      console.log('📬 서버 응답:', toastText);

      if (toastText.includes('완료')) {
        console.log('✅ 예약이 성공적으로 완료되었습니다!');
      } else {
        console.log('⚠️  예약 처리 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.log('⚠️  Toast 메시지를 찾을 수 없습니다. 콘솔 로그를 확인하세요.');
    }

    // 결과 확인을 위해 잠시 대기
    await page.waitForTimeout(3000);

    console.log('\n✅ 테스트 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error);

    // 스크린샷 저장
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('📸 오류 스크린샷 저장: error-screenshot.png');
  } finally {
    // 브라우저는 닫지 않고 유지 (결과 확인용)
    console.log('\n🔍 브라우저를 열어둡니다. 결과를 확인하세요.');
    console.log('종료하려면 Ctrl+C를 누르세요.');

    // 무한 대기
    await new Promise(() => {});
  }
}

testBooking();
