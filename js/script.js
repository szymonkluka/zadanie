/* document.getElementById('test-button').addEventListener('click', function(){
const links = document.querySelectorAll('.titles a');
console.log('links:', links);
}); */
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tags').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  articleAuthorList: Handlebars.compile(document.querySelector('#template-article-author-list').innerHTML),
};
const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');
  //console.log(event);
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){

    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  //console.log('clickedElement:', clickedElement);
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  //console.log(articleSelector);
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  //console.log(targetArticle);
  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
};
  /* 6.4 */
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';
const generateTitleLinks = function(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  // console.log(titleList);
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
  /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    // console.log(linkHTML);
    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
};
generateTitleLinks();
/* 7.2 */
const calculateTagsParams = function(tags){
  const params = {
    max : 0,
    min : 999999,
  };
  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};
const calculateTagClass = function(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1);
  return (optCloudClassPrefix + classNumber);
};
const generateTags = function(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const titleList = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      //console.log(tag);
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, tag: tag};
      const linkHTML = templates.articleTag(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
      //console.log('allTags:', allTags);
      /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */
    /* insert HTML of all the links into the tags wrapper */
    titleList.innerHTML = html;
    /* END LOOP: for every article: */
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams:', tagsParams);
    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      //allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
      /* [NEW] END LOOP: for each tag in allTags: */
      /* [NEW] add html from allTagsHTML to tagList */
      tagList.innerHTML = templates.tagCloudLink(allTagsData);
      //console.log(allTagsData);
    }
  }
};
generateTags();

const tagClickHandler = function(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks){+
  /* remove class active */
  activeLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const allLinks = document.querySelectorAll('a[href="#tag-' + tag + '');
  /* START LOOP: for each found tag link */
  for(let link of allLinks){
  /* add class active */
    link.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};


const addClickListenersToTags = function(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let link of links){
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
};
addClickListenersToTags();



const generateAuthors = function () {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
  /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* get authors from data-author attribute */
    const author = article.getAttribute('data-author');
    /* generate HTML of the link */
    const linkHTMLData = {id: author, authors: author};
    const linkHTML = templates.articleAuthor(linkHTMLData);
    /* insert author to a paragraph */
    authorWrapper.innerHTML = linkHTML;
    /* [NEW] check if this author is NOT already in allAuthors */
    if(!allAuthors[author]) {
      /* [NEW] add generate code to allAuthors object */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  /* END LOOP: for every article*/
  }
  /* [NEW] find list of authors in right column */
  const authorsList = document.querySelector(optAuthorsListSelector);
  /* [NEW] create variable for all links HTML code */
  const allAuthorsData = {authors: []};
  /* [NEW] START LOOP: for each author in allAuthor: */
  for(let author in allAuthors){
  /* [NEW] generate code of a link and add it to allAuthorsHTML */

    //allAuthorsHTML += '<li><a href="#author-' + author + '" >' + author + ' (' + allAuthors[author] + ') </a></li> ';
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
    /* [NEW] END LOOP: for each tag in allTags: */
    /* [NEW] add html from allTagsHTML to tagList */
    authorsList.innerHTML = templates.articleAuthorList(allAuthorsData);
  }
};
generateAuthors();

const authorClickHandler = function(event){
  console.log('wszedłem tutaj');
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  //console.log(author);
  /* find all author links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks){
  /* remove class active */
    activeLink.classList.remove('active');
  //console.log(activeLink);
  /* END LOOP: for each active tag link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const allLinks = document.querySelectorAll('a[href="#author-' + author + '"]');
  //console.log(allLinks);
  /* START LOOP: for each found author link */
  for(let link of allLinks){
  /* add class active */
    link.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
};




const addClickListenersToAuthors = function(){
  /* find all links to authors */
  const AuthorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  console.log(AuthorLinks);
  for (let AuthorLink of AuthorLinks){
  /* add authorClickHandler as event listener for that link */
    AuthorLink.addEventListener('click', authorClickHandler);
  }
};
addClickListenersToAuthors();
