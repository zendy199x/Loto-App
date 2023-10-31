export const convertHtmlStringToArr = (htmlString: string) => {
  const liTagRegex = /<li>(.*?)<\/li>/g;
  const liTags = htmlString.matchAll(liTagRegex);
  const arrayFromLITags = [];

  for (const liTag of liTags) {
    arrayFromLITags.push(liTag[1]);
  }

  return arrayFromLITags;
};
