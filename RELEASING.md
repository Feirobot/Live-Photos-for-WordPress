# 发布流程 / Releasing

本项目的 npm 发布由 **GitHub Actions + npm Trusted Publishing (OIDC)** 完成：
推送 `v*` tag 后自动跑测试、构建并发布，**不需要本地登录 npm，也不需要动态验证码（OTP）**。

---

## 1. 正常发版（推荐）

在仓库根目录：

```bash
# ① 更新 CHANGELOG.md 后提交代码
git add -A && git commit -m "docs: update changelog"

# ② 升版本号（会同时创建 commit 和 tag，二者版本号自动一致）
npm version patch     # 或 minor / major

# ③ 推送提交和 tag
git push origin main --follow-tags
```

推送 tag 后，`.github/workflows/publish.yml` 会自动执行：

```
checkout → setup-node → npm ci（含构建）→ npm test → 校验 tag 与 package.json 版本一致 → npm publish --provenance
```

发布结果查看：<https://www.npmjs.com/package/live-photo-component>

## 2. 手动触发

GitHub → **Actions** → **Publish to npm** → **Run workflow**
（适用于补发已存在的 tag；`workflow_dispatch` 不校验 tag）

## 3. 一次性配置（Trusted Publishing）

需要仓库所有者在 npm 网页上配置一次（无法通过 CLI 完成）：

1. 打开 <https://www.npmjs.com/package/live-photo-component/access>
2. **Trusted Publishing** → Add a publisher → **GitHub Actions**
3. 填写：

   | 字段 | 值 |
   | --- | --- |
   | Organization or user | `Feirobot` |
   | Repository | `live-photo-component` |
   | Workflow filename | `publish.yml` |
   | Environment | 留空 |

4. 保存后即可用 tag 触发自动发布。

> 配置完成后，本机 `~/.npmrc` 里的 token 可以保留作应急，也可以到
> <https://www.npmjs.com/settings/~/tokens> 删除。

## 4. 备用：本地发布

仅在 Actions 不可用时使用（本机已登录 npm；账号开启 2FA，可能要求 OTP）：

```bash
cd ~/live-photo-component
npm test
npm publish            # 若提示 OTP，可用网页授权链接完成
```

## 5. dist-tags 约定（两套交付版本）

| dist-tag | 版本 | 适用场景 |
| --- | --- | --- |
| `latest` | `1.2.x` | 新项目推荐：`photo` + `video` 播放 + 原生实况照片识别 + `<live-photo-uploader>` |
| `manual` | `1.0.0` | 只需最简 `photo` + `video` 播放器（无识别能力） |

推送 tag 发布新版本时，`latest` 会自动前移；**`manual` 需要手动维护**：

```bash
npm dist-tag add live-photo-component@1.0.0 manual
```

## 6. 发布前检查清单

- [ ] `npm test` 通过
- [ ] `CHANGELOG.md` 已更新
- [ ] `package.json` 版本与将要推送的 tag 一致（workflow 会强校验，不一致直接失败）
- [ ] 若改动影响两套交付版本，同步更新 README 中的版本对照表
