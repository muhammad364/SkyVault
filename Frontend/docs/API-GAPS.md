# SkyVault Frontend — API Gaps

No API gaps discovered during Phase 0.

The authentication API exposes JWT issuance through login but no refresh-token endpoint. The frontend will not invent refresh behavior; Phase 3 will centralize expiry/sign-out handling around the existing contract.

## Phase 2

- Resolved by owner decision on 2026-08-20: `StoragePlanResponseDto.Price` values are displayed as PKR. A currency field remains preferable for future multi-currency support, but no API change is needed for this product decision.

## Phase 3

- Resolved by the owner-approved authentication exception on 2026-08-20: resend verification and change password now have explicit API contracts, recovery responses are generic, and verification/reset emails target the frontend routes.
- The API still has no refresh-token contract. The frontend therefore uses only the issued access token, checks the API-provided expiry, and clears the session on expiry or an authenticated `401`; no refresh behavior was invented.
- Logout remains a stateless server acknowledgement. The frontend always cancels and clears private queries and removes the local access-token session, including when the logout request fails.
- Phase 3 closure (2026-08-20): the owner completed and accepted the end-to-end authentication and account journey, including delivered verification email links. No unresolved authentication API gap blocks completion.
