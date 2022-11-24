import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  ScrollView,
} from "react-native";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  GeoPoint,
  getGeoPoint,
} from "firebase/firestore";
import { DB } from "../firebase";
import { BottomSheet } from "react-native-btr";

export default function Map({ navigation }) {
  // BottomSheet
  const [visible, setVisible] = useState(false);
  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };

  // SearchBox
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  // Markers
  const [marks, setMarks] = useState([]);
  //markers collection에서 모든 문서 읽어와서 marks 배열에 저장
  useEffect(() => {
    const q = query(collection(DB, "markers"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push(
          new GeoPoint(doc.data().loc.latitude, doc.data().loc.longitude)
        );
      });
      setMarks(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.561025,
          longitude: 126.94654,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        provider={PROVIDER_GOOGLE}
        maxZoomLevel={30}
      >
        {/* marks 배열에서 하나씩 꺼내서 marker 찍기 */}
        {marks.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={`${index}`}
              description="this is a marker example"
              onPress={toggleBottomNavigationView}
            />
          );
        })}
      </MapView>

      {/* 장애물 제보 버튼 */}
      <View
        style={{
          position: "absolute",
          bottom: "20%",
          alignSelf: "center",
        }}
      >
        <Button
          title="장애물 제보"
          onPress={() => navigation.navigate("CreatePost")}
        />
      </View>
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}
        <View style={styles.bottomNavigationView}>
          <ScrollView style={styles.scrollView}>
            <Text
              style={{
                textAlign: "center",
                padding: 20,
                fontSize: 20,
              }}
            >
              건물정보
            </Text>
            <Button title="게시판으로 이동" onPress={alert}></Button>
          </ScrollView>
        </View>
      </BottomSheet>
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
    // 수정하기
    height: Dimensions.get("window").height - 20,
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  scrollView: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
