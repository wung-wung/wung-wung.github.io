var posts=["2025/10/29/我的网站搭建历程/","2025/10/31/数据结构·线性表/","2025/11/01/实现九九乘法表/","2025/11/01/水仙花数/","2025/11/01/鸡兔同笼问题/","2025/10/31/鸿蒙学习难点~数据扁平化/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };