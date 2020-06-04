
/**
 *该部分主要为利用a标签实现下载的功能 
 */
const download = (
  url: string,
  fileName: string = url.substring(url.lastIndexOf("/") + 1)
) => {

  let link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

}

export default download
