import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";

import env from "../../../Env"

const { width, height } = Dimensions.get("window");
const GOOGLE_API_KEY = env.apikey;

function titleCase(str:any) {
  return str.toLowerCase().split(' ').map(function(word:any) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

type InputAutocompleteProps = {
  label: string;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
          components: 'country:ae'
        }}
      />
    </>
  );
}

export default function Details(props:any) {

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const INITIAL_POSITION = {
    latitude: 25.1243,
    longitude: 55.4096,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };



  const car = titleCase(props.navigation.state.params.car)
  const model = props.navigation.state.params.model
  const fuel = props.navigation.state.params.fuel.toLowerCase().includes("electr")?"Electricity":props.navigation.state.params.fuel
  const fuelper100km = props.navigation.state.params.fuelper100km
  const fuelcapacity = props.navigation.state.params.fuelcapacity
  const currentFuel = props.navigation.state.params.currentFuel
  const minimum = fuel.toLowerCase().includes("electr")?15:6
  const units=fuel.toLowerCase().includes("electr")?"kWh":"L"


  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef<MapView>(null);

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args: any) => {
    if (args) {
      // args.distance
      // args.duration
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
      setShowDirections(true);
      
      
    }
  };


  const calculateFuel = (dist: any) => {
        return (dist.toFixed(2)*(fuelper100km/100)).toFixed(2)

  }


  const calculateRemainingFuel= (requiredFuel:any, currentFuel:any)=>{
    if (requiredFuel>currentFuel) return 0
    else{
      return (currentFuel-requiredFuel).toFixed(2)
    }
  }


  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => {
    
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    
    set(position);
    moveTo(position);
    
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={6}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <InputAutocomplete
          label="Origin"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <InputAutocomplete
          label="Destination"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "destination");
          }}
        />
        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace route</Text>
        </TouchableOpacity>
        {distance && duration&&showDirections ? (
          <View>
            <Text>Distance: {distance.toFixed(2)} km</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
            <Text>Car Model: {car} {model}</Text>
            <Text>{fuel} required: {calculateFuel(distance)} {units}</Text>
            <Text>Current {fuel}: {currentFuel} {fuel.toLowerCase().includes("electr")?"kWh":"L"}</Text>
            <Text>Remaining: 
              <Text 
              style={calculateRemainingFuel(calculateFuel(distance),currentFuel)>=minimum?styles.remainingfuelgood:styles.remainingfuelbad}>{calculateRemainingFuel(calculateFuel(distance),currentFuel)} {fuel.toLowerCase().includes("electr")?"kWh":"L"}
              </Text>
              </Text>

              <View style={styles.necessary}>
                <Text 
              style={calculateRemainingFuel(calculateFuel(distance),currentFuel)>=minimum?styles.remainingfuelgood:styles.remainingfuelbad}>
                {calculateRemainingFuel(calculateFuel(distance),currentFuel)>=minimum?"":`Remainging Fuel Below ${minimum} ${units} Refuel Needed`}
              </Text>
              </View>
            {/* <Text>Number Of Stops on a full {fuel.toLowerCase().includes("electr")?"charge":"tank"}: {Math.floor(((distance.toFixed(2)*(fuelper100km/100)).toFixed(2))/fuelcapacity)}</Text> */}
            

          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
  remainingfuelgood:{
    color:"green"
  },
  remainingfuelbad:{
    color:"red"
  },
  necessary:{
    alignItems: "center"
  }
  
});
