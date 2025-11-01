
// Central flags to avoid long SSG on DB-backed pages.
export const dynamic = 'force-dynamic';     // render at request time
export const revalidate = 0;                 // no ISR
export const fetchCache = 'force-no-store';  // bypass fetch cache during build
