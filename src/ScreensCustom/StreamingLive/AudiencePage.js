import React, { useEffect, useRef, useState } from 'react';
import { Modal, TouchableOpacity, findNodeHandle } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import ZegoUIKitPrebuiltLiveStreaming, {
  AUDIENCE_DEFAULT_CONFIG,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import * as ZIM from 'zego-zim-react-native';
// import KeyCenter from "../KeyCenter";
// import { APP_ID_ZIGO_STREAMING, APP_SIGN_ZIGO_STREAMING, secret } from '../ConnectionStrings';
import { APP_ID_ZIGO_STREAMING, APP_SIGN_ZIGO_STREAMING } from '../../Utils/Strings';

import ZegoUIKit from '@zegocloud/zego-uikit-rn';
import ZegoExpressEngine, { ZegoAlphaLayoutType, ZegoMediaPlayerResource, ZegoMediaPlayerState, ZegoMultimediaLoadType, ZegoTextureView } from 'zego-express-engine-reactnative';
import { FileHelper } from './FileHelper.js';

export default function AudiencePage(props) {
  const { route } = props;
  const { params } = route;
  const { userID, userName, liveID } = params;
  const mediaViewRef = useRef();
  const [showGift, setShowGift] = useState(false);
  const [giftModal, setGiftModal] = useState(false);

  useEffect(() => {

    const callbackID = 'callbackID'
    ZegoUIKit.getSignalingPlugin().onInRoomCommandMessageReceived(callbackID, (messageData) => {
      const {roomID, message, senderUserID, timestamp} = messageData;
        console.log(`onInRoomCommandMessageReceived, roomID:${roomID}, message:${message}, senderUserID:${senderUserID}, timestamp:${timestamp}`);
        showGiftAnimation();
    });

    return () => {
      if (this.mediaPlayer) {
        ZegoExpressEngine.instance().destroyMediaPlayer(this.mediaPlayer);
        this.mediaPlayer = null;
      }
      ZegoUIKit.getSignalingPlugin().onInRoomCommandMessageReceived(callbackID);
    }
  }, []);
  const GiftView = async () => {
    console.warn('Gift view clicked')
    setGiftModal(true)
    }
  const showGiftAnimation = async () => {
    setShowGift(true);
    if (!this.mediaPlayer) {
      this.mediaPlayer = await ZegoExpressEngine.instance().createMediaPlayer();

      this.mediaPlayer.on('mediaPlayerStateUpdate', (player, state, errorCode) => {
        if (state === ZegoMediaPlayerState.PlayEnded) {
          console.log('Play Ended');
          setShowGift(false);
        }
      });
    }
    // this.mediaPlayer.enableRepeat = true;
    this.mediaPlayer.setPlayerView({ 'reactTag': findNodeHandle(mediaViewRef.current), 'viewMode': 0, 'backgroundColor': 0, 'alphaBlend': true});

    let resource = new ZegoMediaPlayerResource();
    resource.loadType = ZegoMultimediaLoadType.FilePath;
    resource.alphaLayout = ZegoAlphaLayoutType.Left;

    // 1. For local resource.
    // resource.filePath = FileHelper.getResourceFolder() + '1.mp4';

    // 2. For online resource.
    resource.filePath = 'https://storage.zego.im/sdk-doc/Pics/zegocloud/oss/1.mp4';

    console.log(`File Path: ${resource.filePath}`);
    
    this.mediaPlayer.loadResourceWithConfig(resource).then((ret) => {
      console.log("load resource error: " + ret.errorCode)
      if (ret.errorCode === 0) {
        this.mediaPlayer.start();
      }
    });
  };

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltLiveStreaming
        appID={APP_ID_ZIGO_STREAMING}
        appSign={APP_SIGN_ZIGO_STREAMING}
        userID={userID}
        userName={userName}
        liveID={liveID}
        config={{
          ...AUDIENCE_DEFAULT_CONFIG,
          onLeaveLiveStreaming: () => {
         //   props.
            navigation.navigate('Live');
          },
          topMenuBarConfig: {
            buttons: [ZegoMenuBarButtonName.minimizingButton, ZegoMenuBarButtonName.leaveButton],
          },
          bottomMenuBarConfig: {
            coHostExtendButtons: [<GiftButton onPress={SendGift} />],
            // audienceExtendButtons: [<GiftButton onPress={SendGift} />],            
            audienceExtendButtons: [<GiftButton onPress={GiftView} />],

          },
          
          onWindowMinimized: () => {
            console.log('[Demo]AudiencePage onWindowMinimized');
          //  props.
            navigation.navigate('Live');
          },
          onWindowMaximized: () => {
              console.log('[Demo]AudiencePage onWindowMaximized');
           //   props.
              navigation.navigate('AudiencePage', {
                userID: userID,
                userName: userName,
                liveID: liveID,
              });
          }
        }}
        // plugins={[ZIM]}
      />
      {showGift ? 
        <View style={{height: 350, width: 350, backgroundColor: 'yellow'}}>
          <ZegoTextureView
          // @ts-ignore
          style={{ flex: 1, width: '100%', height: '100%', position: 'absolute' }}
          ref={mediaViewRef}
          collapsable={false}
          />
        </View> : null
      }
      {
        giftModal ? 
        <View
         style={{flex:1,height:'50%', width:'100%', backgroundColor:'green', position:'absolute', bottom:0}}>
      {/* <Modal
      visible={true}
      style={{flex:1}}
      onRequestClose={()=>setGiftModal(false)}
      >
    <View style={{flex:1,height:'70%', width:'100%', backgroundColor:'blue'}}> 
    </View>
      </Modal> */}
     </View>
     :
      null
     }
    </View>
  );

  function SendGift() {
    const url = 'https://zego-virtual-gift.vercel.app/api/send_gift';
    const data = {
      app_id: APP_ID_ZIGO_STREAMING,
      server_secret: secret,
      room_id: liveID,
      user_id: userID,
      user_name: userName,
      gift_type: 1001,
      gift_count: 1,
      timestamp: Date.now(),
    }
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Code === 0) {
          console.log(`SendGift success, ${JSON.stringify(data)}`);
          showGiftAnimation();
        }
      })
      .catch((error) => {
        console.log(`SendGift failed, ${error}`);
      });
  }
}


const GiftButton = ({onPress}) => {
  return (
    <TouchableOpacity
      style={buttonStyles.button}
      // onPress={()=>[console.warn('THIS button show gifts'), GiftView()]}
      onPress={onPress}
    >
      <Text style={buttonStyles.buttonText}>{'Gift'}</Text>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  avView: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
  },
  ctrlBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 50,
    width: '100%',
    height: 50,
    zIndex: 2,
  },
  ctrlBtn: {
    flex: 1,
    width: 48,
    height: 48,
    marginLeft: 37 / 2,
    position: 'absolute',
  },
});