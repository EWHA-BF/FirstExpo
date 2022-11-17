import React, { useState } from 'react';
import styled from 'styled-components';
import {Text, Button} from 'react-native';


const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// 내용 작성 화면
export default function CreatePost({navigation, route}) {

  return (
    <Container>
      <Text>CreatePost</Text>
      <Button 
      title='다음' 
      onPress={()=> {
        // param이 없으면 장애물 - 화면 다르게 이동
        (route.params!==undefined)?
        navigation.navigate('SetDay', route.params):
        navigation.navigate('CreateMarker');
      }
      }/>
      
    </Container>
  );
};
