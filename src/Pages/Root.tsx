import React, { Component } from 'react';
import { Text, View } from 'react-native';
import SModel from '../SModel';

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    describeModels() {

        var Models = SModel._models;
        return Object.keys(Models).map((name) => {
            var obj = Models[name];
            var list = obj._getFunctions();
            console.log(list)
            return <View key={name}>
                <Text style={{
                    textDecorationLine: "underline",
                    fontWeight: "bold"
                }}>{"\t" + name + "\t"}</Text>
                {
                    list.map(obj => <Text>{obj}</Text>)
                }
                <Text>{"\n"}</Text>
            </View>
        })
    }
    render() {
        return (
            <View style={{
                backgroundColor: "#fff",
                flex: 1,
            }}>
                <Text>{"\n"}</Text>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold"
                }}>servisofts-model</Text>
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <View>
                    {this.describeModels()}
                </View>
            </View>
        );
    }
}
export default Root;