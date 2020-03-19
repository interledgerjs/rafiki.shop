docker run --rm -it \
  -e HYDRA_ADMIN_URL=http://oauth-hydra:4445 \
  --network hydra \
  oryd/hydra:latest \
  clients create --skip-tls-verify \
    --id eats.rafiki.shop \
    --secret secret \
    --token-endpoint-auth-method none \
    --grant-types authorization_code,refresh_token \
    --response-types token,code,id_token \
    --scope openid,offline \
    --callbacks http://localhost:4000/callback