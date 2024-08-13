import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const HCard = ({ title, predText, imageUri }) => {
  const numColumns = 2;
  const size = Dimensions.get('window').width / numColumns;

  const img_styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
      margin: 1,
    },
  });

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.card}>
          <Image
            style={img_styles.image}
            source={{ uri: imageUri }}
          />
          <View style={styles.cardText}>
            <Text style={styles.heading}>Prediction:</Text>
            <Text style={styles.text}>{predText}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noImageText}>Start using the app</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  cardText: {
    flex: 1,
    color: '#000',
    marginLeft: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  noImageText: {
    fontSize: 18,
    color: '#888',
    padding: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
});

export { HCard };
