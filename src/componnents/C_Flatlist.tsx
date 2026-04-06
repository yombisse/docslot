// src/components/CustomFlatList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const CustomFlatList = ({ data, renderItem, keyExtractor, title }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Aucun élément à afficher</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default CustomFlatList;