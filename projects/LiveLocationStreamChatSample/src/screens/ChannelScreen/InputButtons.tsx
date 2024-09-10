import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {
  Channel,
  useChannelContext,
  InputButtons as DefaultInputButtons,
  useTheme,
} from 'stream-chat-react-native';
import Svg, {Path} from 'react-native-svg';
import Geolocation from '@react-native-community/geolocation';
import {useLiveLocationContext} from '../../common/LiveLocationContext';

// Icon for "Share Location" button, next to input box.
const ShareLocationIcon = () => {
  const {
    theme: {
      colors: {grey},
    },
  } = useTheme();
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12c-1.654 0-3-1.345-3-3 0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.655-1.346 3-3 3zm0-4a1.001 1.001 0 101 1c0-.551-.449-1-1-1z"
        fill={grey}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22s7-5.455 7-12.727C19 5.636 16.667 2 12 2S5 5.636 5 9.273C5 16.545 12 22 12 22zm1.915-4.857C15.541 15.032 17 12.277 17 9.273c0-1.412-.456-2.75-1.27-3.7C14.953 4.664 13.763 4 12 4s-2.953.664-3.73 1.573C7.456 6.523 7 7.86 7 9.273c0 3.004 1.459 5.759 3.085 7.87.678.88 1.358 1.614 1.915 2.166a21.689 21.689 0 001.915-2.166zm-.683 3.281s0 .001 0 0z"
        fill={grey}
      />
    </Svg>
  );
};

const InputButtons: NonNullable<
  React.ComponentProps<typeof Channel>['InputButtons']
> = props => {
  const {channel: currentChannel} = useChannelContext();
  const {startLiveLocation} = useLiveLocationContext();

  const sendLiveLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const response = await currentChannel.sendMessage({
          attachments: [
            {
              type: 'location',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          ],
        });
        startLiveLocation(response.message.id);
      },
      error => {
        console.error('getCurrentPosition', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  return (
    <>
      <DefaultInputButtons {...props} hasCommands={false} />
      <Pressable style={styles.liveLocationButton} onPress={sendLiveLocation}>
        <ShareLocationIcon />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  liveLocationButton: {
    paddingLeft: 5,
  },
});

export default InputButtons;
