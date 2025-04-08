import { Header } from "../components/header/Header";
import { FavouriteDashboard } from "../components/dashboard/FavouriteDashboard";
import { DataHandlerProvider } from "../context/DataHandlerContext/DataHandlerProvider";
import { CookieNotice } from "../components/cookies/CookieNotice";

const MainPage = () => {
  return (
    <>
      <DataHandlerProvider>
          <Header logoSrc="src/assets/dogecoin-doge-logo.svg" name="CryptoCurrencyApp"/>
          <FavouriteDashboard/>
      </DataHandlerProvider>
      <CookieNotice />
    </>
  )
}

export default MainPage;