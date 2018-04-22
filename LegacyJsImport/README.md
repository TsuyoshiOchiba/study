# LegacyJsImport
## Overview
めでたくECMAScript6でブラウザのJavaScriptでもimportが使えるようになりましたが、ChromeやFireFoxならともかくIEは全滅です。
ChromeやFireFoxでもブラウザのアップデートしてないと利用できないと思われるので、import的な事ができるライブラリを作ってみました。
なお、__ECMAScript6のimport文をシミュレートするライブラリではなく__、jQueryを利用したプラグインとして、ページ単位でスクリプトを読込み実行するタイプのライブラリです。
## Description
### ライブラリ概要
外部JavaScriptファイルを読込み、読込んだJavaScriptファイルを利用した処理をコールバックとして実行するライブラリ。
非同期実行の順序確約API付。
### 動作対象

- jQuery
  - 1.x系 1.10以上
  - 2.x系 2.2 以上
  - 3.x系 3.3 以上

- ブラウザ
  - InternetExplorer 9
  - InternetExplorer 10
    - jQuery1.x系を利用することが条件(Deferdの動作が怪しいため)
  - InternetExplorer 11
  - その他モダンブラウザ
    - jQueryのバージョンは問わないがjQuery2.x系以上(3.x系含む)を推奨

## API一覧
- 初期化
  - セレクタ.import(options)
- 分離実行
  - .execute()
- 設定関連
  - .addSetting(options)
  - .getCallback(category,key)
  - .setCallback(category,key,func)
- 実行前チェック
  - .preCheck(callback)
- オプション
  - src
  - callback
  - immediate
  - orderKeys
  - exceuteOrder
  - globalBeforeCallback
  - globalBeforeCallbackArg
  - executeBeforeCallback
  - executeBeforeCallbackArg
  - executeAfterCallback
  - executeAfterCallbackArg
  - globalAfterCallback
  - globalAfterCallbackArg

## APIリファレンス
### 初期化
#### .import(options)
外部jsファイルの読み込みを実行します。

> 基本的にはこのメソッドひとつで十分です。
> 他の処理を実行してからjsファイルの読み込みと実行を行いたい場合は`immediate`オプションを`false`に設定してください。
> その場合、実行したいタイミングでこのメソッドの返り値のオブジェクトから`execute()`メソッドを呼んでください。
> オプションとして後述のオプションが設定可能です。
> 必須のオプションは`src`オプションのみです。
> セレクタから呼べますが、セレクタはdocumentを指定してください。
> 原理上window以外のセレクタであれば動作するはずですが、documentから呼び出す方が安全です。

```JavaScript:sample.js
$(function(){
  var option = {
    src : {
      "first"  : "./script/first.js",
      "second" : "./script/second.js",
      "third"  : "./script/third.js"
    }
  };
  $(document).import(option);
});
```

### 分離実行
#### .execute()
`import`メソッドで設定されたオプションに従って外部jsファイルの読み込みを実行します。
> `immediate`オプションと組み合わせて使用します。
> `immediate`オプションが`true`の場合、このメソッドは実行されません。

```JavaScript:sample.js
$(function(){
  var option = {
    src : {
      "first"  : "./script/first.js",
      "second" : "./script/second.js",
      "third"  : "./script/third.js"
    },
    immediate : false
  };
  var importObj = $(document).import(option);
  // 中間処理開始
  //   ～
  // 中間処理終了
  importObj.execute();
});
```
