import { StyleSheet } from 'react-native';

export const css = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    large: {
        fontSize: "2em"
    },
    padding: {
        padding: 20
    },
    title: {
        color: "#ff0033",
        marginBottom: 10,
        marginTop: 10,
        padding: 10,        
    },
    bold: {
      fontWeight: "bold"
    },
    border: {
        borderColor: "#ff0033",
        borderWidth: 1,
        borderRadius: 10
    },
    boxContainer: {        
        justifyContent: "center"
    },
    flexRow: {
        width: "100%",
        flexDirection: "row",
    },
    flexCol: {
        flexDirection: "column",
    },
    listContainer: {
        flex: 6,
        width: "100%",
        flexDirection: "column",
    },
    box: {
        height: 80,
        width: 80,
        borderRadius: 10
    }
});
