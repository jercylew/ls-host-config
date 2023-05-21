
import packageInfo from '../../package.json'

const myTrim = (str) => {
  let strOut = str;

  if (strOut[0] === '/') {
    strOut = strOut.substring(1);
  }
  let len = strOut.length;
  if (strOut[len - 1] === '/') {
    strOut = strOut.substring(0, len - 1);
  }
  return strOut;
};

export default function HomeUrlPrefix() {
  let homepage = packageInfo.homepage;
  if (homepage === undefined || homepage === null || homepage === '') {
    return '';
  }

  console.log('homepage: ' + homepage);

  let trimUrl = myTrim(homepage);
  let index = trimUrl.lastIndexOf('/');
  if (index > 0) {
    return trimUrl.substring(index + 1);
  }

  return '';
}