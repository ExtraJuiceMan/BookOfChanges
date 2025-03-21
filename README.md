![taijitu](https://raw.githubusercontent.com/ExtraJuiceMan/BookOfChanges/refs/heads/master/media/images/taijitu.png)


# I Ching - Classic of Changes
![1](https://upload.wikimedia.org/wikipedia/commons/9/9a/Iching-hexagram-01.svg)
![2](https://upload.wikimedia.org/wikipedia/commons/c/c7/Iching-hexagram-02.svg)
![61](https://upload.wikimedia.org/wikipedia/commons/1/1e/Iching-hexagram-61.svg)

**https://classicofchanges.com**

(alt.) https://bookofchanges.xyz

This is a repository for a website serving as a web tool to consult the I Ching (Yijing, Book of Changes, Classic of Changes), and also as a web-format edition of the Richard Wilhelm I Ching translation.

The machine-readable translation of I Ching by Wilhelm/Banes used for this website was sourced from [Adam Blvck](https://github.com/adamblvck/iching-wilhelm-dataset), who sourced a Markdown version from [Harry Wang](https://github.com/harrywang/iching-book), who sourced the original digitized text from a [webpage](http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html) hosted by the University of Parma. 

If there are any issues with the translation, please let me know by opening an issue on this repository. There seem to be a lot of typographical errors at the moment. I myself have fixed dozens of the typographical errors found in the machine-readable translation, but there's a good chance that I haven't caught all of them. In fixing such errors, I used another [digitized version](https://www.wisdomportal.com/IChing/IChing-Wilhelm.html) of Wilhelm's I Ching as a reference.

# Technical Details
This website was written using Vanilla JS. The hexagram casting script found on this website uses the [Four Coin Method](https://en.wikipedia.org/wiki/I_Ching_divination#Four_coins), which yields identical probabilities as with the classic [Yarrow Stalk Method](https://en.wikipedia.org/wiki/I_Ching_divination#Yarrow_stalks). The hexagram random number generation uses the ``Crypto.getRandomValues()`` API with a fallback to ``Math.random()`` if Crypto is unavailable. The website's stylesheet was created using a heavily modified version of [simple.css](https://github.com/kevquirk/simple.css). The hexagrams are drawn and animated using [SVG.js](https://github.com/svgdotjs/svg.js). The machine-readable I Ching data was templated into HTML using [handlebars.js](https://github.com/handlebars-lang/handlebars.js).

No generative AI was used in the creation of this website--it's all the work of one human!

# Website Details
I created this website on a whim after attempting to find a nice online version of the I Ching with a digital hexagram casting tool. I wanted both an aesthetically pleasing copy of the I Ching and an online script to cast I Ching hexagrams with, but it seemed as if no such solution existed. So, I decided to create one. 

After the idea for creating this website came to me, I consulted the I Ching on the action of creating it. I casted a hexagram and received Hexagram 29, Darkness: "The Abysmal repeated, If you are sincere, you have success in your heart, And whatever you do succeeds." Carl Jung happened to receive the same hexagram after asking about his action in writing the foreword to Richard Wilhelm's I Ching translation. The oracle works in strange and unusual ways!
