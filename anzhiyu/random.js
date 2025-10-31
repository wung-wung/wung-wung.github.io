var posts=["2025/10/31/鸿蒙学习难点~数据扁平化/","2025/10/29/我的网站搭建历程/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };