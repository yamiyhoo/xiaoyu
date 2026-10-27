# Changelog

## 0.7.1 — fork

Changes on top of upstream 0.7.0. Upstream: [BigFatWhale/cortico-world-telegram](https://github.com/BigFatFish4Wm/cortico-world-telegram) (MIT).

### Added

- **Group identity in the event text**: group messages now carry the group's title and id
  (`【Telegram 群聊 「示例群」(-1001234567890) 某人(id:123456789)…】`), so two groups whose members
  overlap can be told apart. Private chats keep their previous shape.
- **`tg_send` gets an optional `replyTo`**: `auto` hangs the message under the chat's last message,
  a number targets that message id, anything else (and the default) sends a plain message.

### Changed

- **`senderKey` identifies the person in groups**: `chatId:fromId` instead of `chatId`, which made
  every member of a group look like the same speaker. Private chats still use `chatId`.

### Notes

- Reply anchoring is opt-in on purpose. An earlier build anchored every send to the last inbound
  message, which left the bot unable to start a line of its own.
- `LICENSE` keeps the upstream MIT notice; the fork adds its own copyright line, as MIT requires.
