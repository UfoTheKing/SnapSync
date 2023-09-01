import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Contacts from "expo-contacts";
import Container from "@/components/Container";
import { FlatList } from "native-base";

type Props = {};

const SuggestionsScreen = (props: Props) => {
  const [contacts, setContacts] = React.useState<Contacts.Contact[]>([]);
  const [phoneNumbers, setPhoneNumbers] = React.useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          pageOffset: 0,
          pageSize: 50,
        });

        let phoneNumbers: string[] = [];

        data.forEach((contact) => {
          if (
            contact.phoneNumbers &&
            contact.phoneNumbers.length > 0 &&
            contact.phoneNumbers[0].digits
          ) {
            // Prendo il primo numero di telefono
            phoneNumbers.push(contact.phoneNumbers[0].digits);
          }
        });

        setPhoneNumbers(phoneNumbers);
        setContacts(data);
      }
    })();
  }, []);

  return (
    <Container>
      <FlatList
        data={phoneNumbers}
        renderItem={({ item }) => <Text>{JSON.stringify(item)}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </Container>
  );
};

export default SuggestionsScreen;

const styles = StyleSheet.create({});
