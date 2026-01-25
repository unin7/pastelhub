export const USER_LEVELS = {
  BANNED: -1,
  GUEST: 0,
  MEMBER: 1,    // 구글 로그인
  VERIFIED: 2,  // 네이버 인증
  ACTIVE: 3,    // 우수 회원
} as const;

export type UserLevel = typeof USER_LEVELS[keyof typeof USER_LEVELS];