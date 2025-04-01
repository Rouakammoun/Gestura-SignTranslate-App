// app/components/NavBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NavBar = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>👤</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 10 ,
    left: 5,
    right: 5,
    backgroundColor: '#FFF', // Dark green
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 100
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});

export default NavBar;
