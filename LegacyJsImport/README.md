# LegacyJsImport
## Overview
めでたくECMAScript6でブラウザのJavaScriptでもimportが使えるようになりましたが、ChromeやFireFoxならともかくIEは全滅です。
ChromeやFireFoxでもブラウザのアップデートしてないと利用できないと思われるので、import的な事ができるライブラリを作ってみました。
なお、__ECMAScript6のimport文をシミュレートするライブラリではなく__、jQueryを利用した __プラグイン__ として、 __ページ単位でスクリプトを読込み実行するタイプ__ のライブラリです。
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
    - jQuery1.x系を利用することが条件
  - InternetExplorer 11
  - その他モダンブラウザ
    - jQueryのバージョンは問わないがjQuery2.x系以上(3.x系含む)を推奨
### 注意事項
#### 実行順序保証
InternetExplorerを動作対象としているのは業務システムではまだIE需要が今後も少なくとも数年間は存在すると思われるからです。
そして、IE9とIE10はJqueryのDefferdの動作がかなり怪しく、かなりの動作不良報告が上がっているようです。
従って、本ライブラリの動作順序は本ライブラリAPI内で完結するものとし、promiseオブジェクトは特に返しません。
→要するにjQueryのDefferdリンクの外にいる処理系になります。
モダンブラウザとIEとでreturn値のインターフェイスを変えるのは不合理であるため、IEが滅ぶまではこの方針を継続します。
#### コールバック関数に対する非同期処理の使用について
先の実行順序保証の問題からオプションで設定可能な各種コールバック関数内での非同期処理(`$.ajax()`や`setTimeout()`など)については、非同期処理のエンドを捕えられないため、実行順序保証の対象外とします。
つまり、コールバック関数内での非同期処理はある程度前後関係に依存しない形にしないと予期せぬ動作となることがあります。

## API一覧
- [初期化](#初期化)
  - [セレクタ.import(options)](#importoptions)
- [分離実行](#分離実行)
  - [.execute()](#execute)
- [設定関連](#設定関連)
  - [.addSetting(options)](#addSettingoptions)
  - [.getCallback(category,key)](#getCallbackcategorykey)
  - [.setCallback(category,key,func)](#setCallbackcategorykeyfunc)
- [実行前チェック](#実行前チェック)
  - [.preCheck(callback)](#preCheckcallback)
- [オプション](#オプション)
  - [src](#src)
  - [callback](#callback)
  - [immediate](#immediate)
  - [orderKeys](#orderKeys)
  - [exceuteOrder](#exceuteOrder)
  - [globalBeforeCallback](#globalBeforeCallback)
  - [globalBeforeCallbackArg](#globalBeforeCallbackArg)
  - [executeBeforeCallback](#executeBeforeCallback)
  - [executeBeforeCallbackArg](#executeBeforeCallbackArg)
  - [executeAfterCallback](#executeAfterCallback)
  - [executeAfterCallbackArg](#executeAfterCallbackArg)
  - [globalAfterCallback](#globalAfterCallback)
  - [globalAfterCallbackArg](#globalAfterCallbackArg)

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
`import()`メソッドで設定されたオプションに従って外部jsファイルの読み込みを実行します。
> `immediate`オプションと組み合わせて使用します。
> `immediate`オプションが`true`の場合、このメソッドは実行されません。
> `immediate`オプションが`false`の場合、複数回このメソッドを実行することができますが、登録済みのスクリプトとコールバック処理が重複実行されます。

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

### 設定関連
#### .addSetting(options)
初期化`import()`メソッドで読込んだ設定に追加の設定を行います。
> 何かしらの処理の結果を設定に使いたい場合に使用します。
> しかし、このメソッドが必要なケースはまず、設計ミスを疑うべきであり許容されるとすればajax通信で得られた結果を使用するようなケースです。

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
  $.ajax({
    cache : false,
    dataType : "json",
    url : "https://hoge.com/anyparam?param=1"
  })
  .done(function(data){
    // 受け取ったjsonの中身は下記のコメントとする
    // data = {src : {"forth" : "https://hoge.com/script/forth.js"}}

    // 受け取るjsonの形が規定のオプションのデータ形式に合わない場合は適時互換する
    var opt = data;
    importObj.addSetting(opt);
  })
  .always(function(data){
    // 通信が成功していれば"forth"のscriptまで実行、通信が失敗すれば"third"のscriptまで実行
    importObj.execute();
  });
});
```

#### .getCallback(category,key)
登録されているコールバック関数を取得します。
第一引数の`category`には下記の文字列が使用できます。
- "globalBefore"
  - `globalBeforeCallback`オプションで設定したコールバック関数。単数での登録の場合、引数`key`省略で取得可
- "executeBefore"
  - `executeBeforeCallback`オプションで設定したコールバック関数。単数での登録の場合、引数`key`省略で取得可
- "executingTarget"
  - `callback`オプションで設定したコールバック関数。引数`key`省略不可
- "executeAfter"
  - `executeAfterCallback`オプションで設定したコールバック関数。単数での登録の場合、引数`key`省略で取得可
- "globalAfter"
  - `globalAfterCallback`オプションで設定したコールバック関数。単数での登録の場合、引数`key`省略で取得可
> 登録したコールバック関数を再利用するための仕組みです。
> 基本的には名前空間上に定義された関数(メソッド)を初期化時あるいは追加設定時に登録すれば、このような再取得は必要がないです。
> 後からのシステム改修などで無名関数で登録されてしまっているコールバック関数に可用性を持たせるために使います。

```JavaScript:sample.js
$(function(){
  var option = {
    src : {
      "first"  : "./script/first.js",
      "second" : "./script/second.js",
      "third"  : "./script/third.js"
    },
    callback : {
      "first"  : function(e){
        console.log("first event kicked");
      },
      "second" : function(e){
        console.log("second event kicked");
      },
      "third"  : function(){
        console.log("third event kicked");
      }
    }
  };
  var importObj = $(document).import(option);
  var firstFunc = importObj.getCallback("executingTarget","first");
  // clickイベントなどimport処理が完了したことが確実な処理に使用するとうまく使える
  $(document).on("#firstKick","click",firstFunc);
  // 下記の呼出は読込んだjsを処理の前提にしていると実行できる保証がない
  firstFunc(new Object());
});
```

#### .setCallback(category,key,func)
初期化`import()`メソッドで読込んだ設定に追加のコールバック関数の設定を行います。
第一引数の`category`に使用できる値は`getCallback()`メソッドと同一です。
> 読込み対象のscriptファイルのデータと対応する処理系の記述の分離の為に用意したAPI。
> これも通常では使うことはほとんどないと思われるが、scriptファイルが動的であったりDB管理されている場合に可用性があります。

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
  importObj.setCallback(
    "executingTarget",
    "first",
    function(e){
      console.log("first event kicked");
    }
  );
  importObj.execute();
});
```

### 実行前チェック
#### .preCheck(callback)
登録された設定が実行に際して問題がないかチェックします。
> `immediate`オプションと組み合わせて使用します。
> `immediate`オプションが`true`の場合、`import()`メソッド内部で使用されこのチェックが`false`の場合スクリプトのロードのみを実行します。
> `immediate`オプションが`false`の場合、このAPIを実行することで、コールバック関数の意図しない動作が防げる可能性があります。
> チェック結果は返り値として`boolean`のみ返しますが、引数の`callback`関数に詳細なデータがオブジェクト形式で引き渡されるため、開発中のデバッグコードに使用できます。
##### callbackに渡される詳細なチェックデータ

```JavaScript:data.js
var data = {
  checkResult : boolean,   // チェック総合結果 true / false
  keyDiff : {              // キー差分 オプションの'src'と'callback'のキーの比較 過不足あるキーを返します
    src : [],
    callback : []
  },
  typeOfHttp : {"key":boolean,...}          // 'src'オプションに渡されたURLの妥当性チェック
  typeOfCallback : {"key":boolean,...}      // 'callback'オプションに渡されたオブジェクトが関数であるかのチェック
}
```

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
  if(importObj.preCheck()) importObj.execute();
});
```

### オプション
#### src
>
#### callback
>
#### immediate
>
#### orderKeys
>
#### exceuteOrder
>
#### globalBeforeCallback
>
#### globalBeforeCallbackArg
>
#### executeBeforeCallback
>
#### executeBeforeCallbackArg
>
#### executeAfterCallback
>
#### executeAfterCallbackArg
>
#### globalAfterCallback
>
#### globalAfterCallbackArg
>
