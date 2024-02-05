import { GlobalLoaderConfig } from './global-loader-config';
import "./global-loader.css";

const GlobalLoader = () => {
  const [loading] = GlobalLoaderConfig();
  return (
    <>
      {
        loading && (
          <div className='loader_container'>
            <img className="loader_image" src={require("../../assets/img/loader.png")} alt="Rahul Sutreja" width="120" height="120" />
          </div>
        )
      }
    </>
  )
}

export default GlobalLoader;