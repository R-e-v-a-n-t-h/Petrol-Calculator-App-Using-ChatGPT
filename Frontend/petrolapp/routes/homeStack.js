import { createStackNavigator} from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../components/pages/homepage/Home"
import Details from "../components/pages/detailspage/Details"
import Results from "../components/pages/resultspage/Results"
import Header from "../components/Header";
import Loading from "../components/pages/detailspage/Loading";


const screens ={
    
    Home:{
        screen: Home,
        navigationOptions: {
            headerTitle:() => <Header title= "Home"/>,
            headerStyle: {
      backgroundColor: "#D0BCFF",
    },
    
            
            }

    },
    Details:{
        screen: Details,
        navigationOptions: {
            headerTitle:() => <Header title= "Add Locations"/> ,
            headerStyle: {
      backgroundColor: "#D0BCFF",
    },
            },
            
    },
    // Loading:{
    //     screen: Loading,
    //     navigationOptions: {
    //         headerTitle:() => <Header title= "Home"/> ,
    //         headerStyle: {
    //   backgroundColor: "#D0BCFF",
    // },
    //         },
            
    // },

    Results:{
        screen: Results,
        navigationOptions: {
            headerTitle:() => <Header title= "Resut"/>
        },
        headerStyle: {
      backgroundColor: "#D0BCFF",
    },
    }

}

const HomeStack = createStackNavigator(screens)
export default createAppContainer(HomeStack)