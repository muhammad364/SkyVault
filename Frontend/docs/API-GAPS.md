# SkyVault Frontend — API Gaps

No API gaps discovered during Phase 0.

The authentication API exposes JWT issuance through login but no refresh-token endpoint. The frontend will not invent refresh behavior; Phase 3 will centralize expiry/sign-out handling around the existing contract.

## Phase 2

- Resolved by owner decision on 2026-08-20: `StoragePlanResponseDto.Price` values are displayed as PKR. A currency field remains preferable for future multi-currency support, but no API change is needed for this product decision.
