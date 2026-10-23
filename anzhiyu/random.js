var posts=["2025/11/03/励志文章-破茧成蝶-我的北大之路/","2025/10/31/数据结构·顺序表/","2025/11/14/如何给你的hexo网站更换字体/","2026/10/23/时隔一年，我重拾博客/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };