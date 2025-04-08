import { Header } from "../components/Header";
import { FavouriteDashboard } from "../components/FavouriteDashboard";
import { DataHandlerProvider } from "../components/DataHandlerContext";

interface MainPageProps {
	style: string;
}

const MainPage = ({ style }: MainPageProps) => {
  return (
    <DataHandlerProvider>
        <Header logoSrc="src/assets/dogecoin-doge-logo.svg" name="CryptoCurrencyApp"/>
        <FavouriteDashboard listStyle={style}/>
 		</DataHandlerProvider>
  )
}

export default MainPage;