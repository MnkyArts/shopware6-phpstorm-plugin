export function getConfigXmlTemplate(pluginName: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/platform/trunk/src/Core/System/SystemConfig/Schema/config.xsd">

    <card>
        <title>Basic Configuration</title>
        <title xml:lang="de-DE">Basis Konfiguration</title>

        <input-field type="text">
            <name>exampleTextField</name>
            <label>Example Text Field</label>
            <label xml:lang="de-DE">Beispiel Textfeld</label>
            <helpText>Enter some text</helpText>
            <helpText xml:lang="de-DE">Geben Sie Text ein</helpText>
        </input-field>

        <input-field type="bool">
            <name>exampleBoolField</name>
            <label>Example Boolean Field</label>
            <label xml:lang="de-DE">Beispiel Boolean Feld</label>
        </input-field>

    </card>
</config>
`;
}
