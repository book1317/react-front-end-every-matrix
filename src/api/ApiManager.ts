import { AxiosResponse, AxiosInstance, AxiosError } from "axios";

interface IGetParams {
  url: string;
  params?: any;
}

interface IPostParams {
  url: string;
  body: any;
  params?: any;
}

class ApiManager {
  instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  get = async ({ url, params }: IGetParams) => {
    try {
      const response: AxiosResponse = await this.instance.get(url, {
        params,
      });
      return response?.data;
    } catch (err: any) {
      console.log("url: " + url + "\n" + "error: " + err);
      alert("url: " + url + "\n" + "error: " + err.message);
      throw err;
    }
  };
  post = async ({ url, body, params }: IPostParams) => {
    try {
      const response: AxiosResponse = await this.instance.post(url, body, {
        params,
      });
      return response?.data;
    } catch (err: any) {
      console.log("url: " + url + "\n" + "error: " + err);
      alert("url: " + url + "\n" + "error: " + err.message);
      throw err;
    }
  };
}

export default ApiManager;
