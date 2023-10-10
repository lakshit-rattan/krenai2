/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import dings from './assets/audio.mp3';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Video from 'react-native-video';
import srtParser2 from 'srt-parser-2';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {songs} from './songs';
import Tooltip from 'react-native-walkthrough-tooltip';
import axios from 'axios';
import {Header as HeaderRNE, HeaderProps, Icon} from '@rneui/themed';

const apiKey = '4c06f5f0-a5b5-4802-bc0e-79c4d17a92f5';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

Sound.setCategory('Playback');
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

var ding = new Sound(dings, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // if loaded successfully
  console.log(
    'duration in seconds: ' +
      ding.getDuration() +
      'number of channels: ' +
      ding.getNumberOfChannels(),
  );
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const playBackState = usePlaybackState();

  useEffect(() => {
    setupPlayer();
  }, []);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.add(songs);
    } catch (error) {
      console.log(error);
    }
  };

  const togglePlayback = async playbackState => {
    if (playBackState === State.Paused || playBackState === State.Ready) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  const [playing, setPlaying] = useState();
  useEffect(() => {
    ding.setVolume(1);
    return () => {
      ding.release();
    };
  }, []);
  const playPause = () => {
    if (ding.isPlaying()) {
      ding.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
      ding.play(success => {
        if (success) {
          setPlaying(false);
          console.log('successfully finished playing');
        } else {
          setPlaying(false);
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : 'white',
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitles, setSubtitles] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [meaning, setMeaning] = useState('Loading....');
  const videoRef = React.createRef();
  const progress = useProgress();

  const getCurrentTime = () => {};

  // useEffect(() => {
  // Fetch and parse the SRT file
  // const readSRTFromAssets = async () => {
  //   try {
  //     const srtFilePath = require('./src/assets/subs.srt'); // Replace with the actual file name
  //     console.log('1');
  //     const srtText = await fetch('./src/assets/subs.srt').then(response =>
  //       response.text(),
  //     );
  //     console.log('2');
  //     const srtParser = new srtParser2();
  //     console.log('3');
  //     srtParser.feed(srtText);
  //     setSubtitles(srtParser.get());
  //   } catch (error) {
  //     console.error('Error reading or parsing SRT file from assets:', error);
  //   }
  // };

  //   readSRTFromAssets();
  // }, []);

  // Define your audio source

  // const audioSource = require('./src/assets/audio.mp3'); // Replace with your audio file

  // const getCurrentSubtitle = () => {
  //   const currentSubtitle = subtitles.find(
  //     subtitle =>
  //       currentTime >= subtitle.startTime && currentTime <= subtitle.endTime,
  //   );
  //   return currentSubtitle ? currentSubtitle.text : '';
  // };

  // const onPlayPausePress = () => {
  //   if (isPlaying) {
  //     videoRef.current.pause();
  //   } else {
  //     videoRef.current.seek(currentTime);
  //     videoRef.current.play();
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  // const onAudioProgress = data => {
  //   setCurrentTime(data.currentTime);
  // };

  const textData = [
    'Caring for the old: On the United Nations Population Fund’s India Ageing Report 2023 India must attune its policies to ensure the elderly live a life of dignity.',
    `AA good part of the world’s population is growing older, and India mirrors this trend as well. The reality, according to the United Nations Population Fund’s India Ageing Report 2023, is that the population above 60 years will double from 10.5% or 14.9 crore (as on July 1, 2022) to 20.8% or 34.7 crore by 2050. With one in five individuals set to be a senior citizen, there will be implications for health, economy, and society. In Kerala and West Bengal for instance, there is a growing population of the elderly who live alone as children migrate for better opportunities. With life expectancy increasing, thanks to better ways to fight disease, and decreasing fertility rates in many countries, including India, there are challenges in nurturing an expanding elderly population. Within this macro phenomenon, there are myriad other data of importance. For instance, women elderly citizens outnumber their male counterparts. At 60 years, a person in India may expect to live another 18.3 years, which is higher in the case of women at 19 years compared to men at 17.5 years. If women in India, where labour force participation is low at 24%, do not have economic and social security, they will become more vulnerable in old age.`,
    `There are also significant inter-State variations. Most States in the south reported a higher share of the elderly population than the national average in 2021, a gap that is expected to widen by 2036. While States with higher fertility rates, such as Bihar and Uttar Pradesh, expect to see an increase in the share of the elderly population too by 2036, the level will remain lower than the Indian average. Overall, more than two-fifths of the elderly are in the poorest wealth quintile — ranging from 5% in Punjab to 47% in Chhattisgarh; also, 18.7% of the elderly do not have any income. A high proportion of the rural population is among the elderly and often economically deprived. To meet the challenges, physical and mental health, basic needs of food and shelter, income security, and social care, a ‘whole-of- society’ approach is required. Geriatric care must be fine-tuned to their unique health-care needs. There are several schemes targeting the elderly but many are unaware of them or find it too cumbersome to sign up. The National Policy on Older Persons, 1999 and the Maintenance and Welfare of Parents and Senior Citizens Act, 2007 lay down the care of the elderly but to ensure that senior citizens live in dignity, public and private policies must provide a more supportive environment.`,
  ];

  // const words = text.split(' ');

  const getWordDefinition = async word => {
    try {
      const response = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`,
      );

      // Check if the response is an array of definitions
      if (Array.isArray(response.data)) {
        // Assuming the first entry in the array is the primary definition
        const primaryDefinition = response.data[0].shortdef[0];
        console.log(primaryDefinition);
        // return primaryDefinition;
        setMeaning(primaryDefinition);
      } else {
        // Handle the case where the word is not found
        return 'Word not found in the dictionary.';
      }
    } catch (error) {
      console.error('Error fetching word definition:', error);
      return 'Error fetching word definition.';
    }
  };

  const handleWordTap = word => {
    getWordDefinition(word);
    setSelectedWord(word);
    setIsTooltipVisible(true);
  };

  const closeTooltip = () => {
    setSelectedWord(null);
    setIsTooltipVisible(false);
  };
  return (
    <>
      <HeaderRNE
        containerStyle={{backgroundColor: 'white', paddingVertical: 20}}
        leftComponent={{
          icon: 'menu',
          color: '#000',
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => {}}>
              <Text>1/7</Text>
            </TouchableOpacity>
          </View>
        }
        centerComponent={{
          text: 'Oct 3 - Taking Care of the Old',
          style: styles.heading,
        }}
      />
      <SafeAreaView
        style={{
          backgroundColor: '#848482',
          paddingHorizontal: 20,
          paddingVertical: 10,
          flex: 1,
        }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{backgroundColor: 'white'}}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              marginVertical: 20,
            }}>
            <View style={{backgroundColor: 'grey'}}>
              <Button
                title={
                  playBackState === State.Paused ||
                  playBackState === State.Ready
                    ? 'Play'
                    : 'Pause'
                }
                onPress={async () => {
                  playBackState === State.Paused ||
                  playBackState === State.Ready
                    ? await TrackPlayer.play()
                    : await TrackPlayer.pause();
                }}
              />
              <Slider
                tapToSeek={true}
                minimumValue={0}
                maximumValue={100}
                value={progress.position}
                minimumTrackTintColor="#fff"
                onValueChange={async e => {
                  console.log(e);
                  console.log(progress.duration);
                  await TrackPlayer.seekTo(e);
                }}
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingVertical: 20,
              }}>
              <View style={{flex: 1}}>
                <Button
                  title="Listening"
                  onPress={() => {
                    Alert.alert('Listening activated');
                    setIsReading(false);
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <Button
                  title="Reading"
                  onPress={() => {
                    Alert.alert('Reading activated');
                    setIsReading(true);
                  }}
                />
              </View>
            </View>
            {isReading ? (
              <View style={{}}>
                {textData.map((paragraph, paragraphIndex) => (
                  <Text
                    key={paragraphIndex}
                    style={{
                      marginBottom: 8,
                    }}>
                    {paragraph.split(' ').map((word, wordIndex) => (
                      <TouchableOpacity
                        key={wordIndex}
                        onLongPress={() => {
                          if (word.length > 2) handleWordTap(word);
                        }}
                        style={{flex: 1}}
                        disabled={word.length <= 2}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'black',
                            fontFamily: 'times new roman',
                          }}>
                          {word}{' '}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Text>
                ))}
                <Tooltip
                  // useReactNativeModal={false}
                  isVisible={isTooltipVisible}
                  content={
                    <Text
                      style={{
                        fontFamily: 'times new roman',
                      }}>
                      {selectedWord} - {meaning}
                    </Text>
                  }
                  onClose={() => {
                    setIsTooltipVisible(false);
                    setMeaning('Loading.....');
                  }}
                />
              </View>
            ) : (
              <>
                <Text style={{fontSize: 14, color: 'black', lineHeight: 20}}>
                  Work in Progress
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
  },
  heading: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerRight: {
    marginTop: 10,
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
