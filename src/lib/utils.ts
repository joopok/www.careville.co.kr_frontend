import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.matchMedia("(max-width: 768px)").matches
}

export function handlePhoneCall(phoneNumber: string = "1600-9762"): void {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
  
  if (isMobileDevice()) {
    // Mobile: Direct phone call
    window.location.href = `tel:${cleanNumber}`
  } else {
    // Desktop: Show alert with phone number
    alert(`케어빌 고객센터: ${phoneNumber}\n\n이 번호로 전화해 주세요.`)
  }
}
