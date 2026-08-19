# SkyVault Frontend — API Gaps

No API gaps discovered during Phase 0.

The authentication API exposes JWT issuance through login but no refresh-token endpoint. The frontend will not invent refresh behavior; Phase 3 will centralize expiry/sign-out handling around the existing contract.
