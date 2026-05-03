import axios from "axios";


const api = axios.create({
  baseURL: "https://tinyurlapi-dhinakar-czfpfubacsh9hafw.southindia-01.azurewebsites.net/api/Url",
});

export default api;