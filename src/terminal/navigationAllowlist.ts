/**
 * Navigation Allowlist
 * 
 * Strict allowlist of approved internal paths and external trusted links.
 * Prohibits open redirects, arbitrary protocol schemes (e.g. javascript:),
 * and unverified external destinations.
 */

export const APPROVED_INTERNAL_ROUTES = new Set<string>([
  '/',
  '/cv',
  '/case-study/coach-prospers-world',
  '/case-study/cfss',
  '/case-study/mastery-os',
  '/case-study/agrichem',
  '/#hero',
  '/#about',
  '/#work',
  '/#skills',
  '/#timeline',
  '/#research',
  '/#contact',
]);

export const APPROVED_EXTERNAL_URLS = new Set<string>([
  'https://github.com/joshuawinyelsum',
  'https://linkedin.com/in/joshuawinyelsum',
  'https://coachprospersworld.org',
  'mailto:joshuawinyelsum@gmail.com',
  'tel:+233549216347',
]);

/**
 * Validates whether a target internal route is permitted.
 */
export function isApprovedInternalRoute(route: string): boolean {
  return APPROVED_INTERNAL_ROUTES.has(route.trim());
}

/**
 * Validates whether an external URL is on the trusted allowlist.
 */
export function isApprovedExternalUrl(url: string): boolean {
  return APPROVED_EXTERNAL_URLS.has(url.trim());
}
