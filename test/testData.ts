import * as utils from "../libs/utils.ts";
import { GlobalModifier, LocalModifier, Tag } from "../libs/item.ts";

export const movabletype_testData = {
  invalidUrlItem: new Tag(
    "MTInvalidURLItem",
    "undefined",
    "",
    "invalid url",
    {},
  ),

  expected_tag1: new Tag(
    "MTActions",
    "block",
    [
      "ユーザーの投稿した記事やトピック、コメント、お気に入り登録など、コミュニティ内でのアクション一覧を表示するためのブロックタグです。",
      "Movable Type 7 では、コミュニティ機能が同梱されていないため利用できません。",
    ].join("\n"),
    "https://movabletype.jp/documentation/appendices/tags/actions.html",
    {
      sort: new LocalModifier(
        "sort",
        "アクションを並べる方法を選択します。authored_on はユーザー名順、created_on (初期値) は時系列に並べます。",
        "authored_on | created_on",
      ),
    },
  ),

  expected_tag2: new Tag(
    "MTEntryIfExtended",
    "block",
    [
      "記事の続きが入力されているときに実行する条件タグです。",
      "Movable Type 3.3 以降では、MTIf ブロックタグを利用した方法を推奨しています。",
      '<mt:If tag="EntryMore">...</mt:If>',
    ].join("\n"),
    "https://www.movabletype.jp/documentation/appendices/tags/entryifextended.html",
    {},
  ),

  expected_modifier: new GlobalModifier(
    "capitalize",
    "1 を指定すると、モディファイアを付与したファンクションタグの値に含まれる単語の最初の文字を大文字に変更し、残りの文字を小文字に変換します。",
    "https://www.movabletype.jp/documentation/appendices/modifiers/capitalize.html",
  ),
};
