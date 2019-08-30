

import React from 'react'
const css = require('./index.less')

function syntaxHighlight(json: any) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match: any) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = css['key'];
            } else {
                cls = css['string'];
            }
        } else if (/true|false/.test(match)) {
            cls = css['boolean'];
        } else if (/null/.test(match)) {
            cls = css['null'];
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

const JsonView = ({ json, style = {} }: { json: any, style?: {} }) => {
    let str = syntaxHighlight(json)
    return (
        <pre dangerouslySetInnerHTML={{ __html: str }} style={{ background: 'rgba(204, 197, 197, 0.2)', padding: 10, overflow: 'hidden', ...style }} />
    )
}

export default JsonView
