import * as utils from "../libs/utils.ts";

export const expected_tag1: utils.TItem = {
  name: "MTActions",
  description: [
    "ユーザーの投稿した記事やトピック、コメント、お気に入り登録など、コミュニティ内でのアクション一覧を表示するためのブロックタグです。",
    "Movable Type 7 では、コミュニティ機能が同梱されていないため利用できません。",
  ].join("\n"),
  type: "block",
  url: "https://movabletype.jp/documentation/appendices/tags/actions.html",
  modifiers: {
    "sort": {
      name: "sort",
      type: "local",
      value: "authored_on | created_on",
      description:
        "アクションを並べる方法を選択します。authored_on はユーザー名順、created_on (初期値) は時系列に並べます。",
    },
  },
};

export const expected_tag2: utils.TItem = {
  name: "MTEntryIfExtended",
  description: [
    "記事の続きが入力されているときに実行する条件タグです。",
    "Movable Type 3.3 以降では、MTIf ブロックタグを利用した方法を推奨しています。",
    '<mt:If tag="EntryMore">...</mt:If>',
  ].join("\n"),
  type: "block",
  url:
    "https://www.movabletype.jp/documentation/appendices/tags/entryifextended.html",
  modifiers: {},
};
