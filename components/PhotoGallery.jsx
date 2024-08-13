import { FlatList, Image, StyleSheet, Dimensions } from 'react-native';

export function PhotoGallery({ route }) {
  const { photos } = route.params;
  const numColumns = 3;
  const size = Dimensions.get('window').width / numColumns;
  
  const styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
      margin: 1,
    },
    listProps:{
      backgroundColor: "#F5FCCF"
    }
  });

  return (
    <FlatList
      style={styles.listProps}
      data={photos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Image source={{ uri: item.imageUri }} style={styles.image} />}
      numColumns={numColumns} 
      contentContainerStyle={styles.list}
    />
  );
}
