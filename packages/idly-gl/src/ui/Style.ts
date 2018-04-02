import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';

// export const Style = ``;
export const Style: TemplateResult = html`
<style>
.idly-gl .container {
    --highlight-secondary: #ecf1fa; --highlight-primary: #1da1f2; --bg-dark-color: #f3f3f3; --border-color: #cccccc; --darkest-color: #777; background-color: white;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    /* max-height: 300px; */
    min-width: 240px;
    max-width: 240px;
    color: rgba(0,0,0,0.8);
    cursor: default;
}

.idly-gl .link a {
    /* color: rgba(0,0,0,0.8); */
    text-decoration: none;
    cursor: pointer;
    font-weight: 500;
    color: var(--darkest-color);
}

.idly-gl .link .select-entity-popup:hover {
    color: #1da1f2;
    padding: 6px 12px 6px 3px;
}

.idly-gl .link .select-entity-popup {
    padding:  6px 12px 6px 3px;
}


.idly-gl .idly-gl-icon.link {
    max-width: unset;
}

.idly-gl .link a:hover {
    color: black;
    max-width: unset;
}

.idly-gl .dark-bg {
    background-color: var(--bg-dark-color);
}

.idly-gl .title {
    /* font-size: 14px; */
    font-weight: 500;
    padding-left: 3px;
}

.idly-gl .tab-row {
    display: flex;
    height: 25px;
    background-color: var(--bg-dark-color);
    border-bottom: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
    /* padding: 2px 2px 0 2px; */
}

.idly-gl .tab-row.mini {
    border-top: 1px solid var(--border-color);
    /* border-bottom: unset; */
}

.idly-gl .icon-row {
    display: flex;
    height: 25px;
    padding-left: 3px;
    background-color: var(--bg-dark-color);
    /* border-bottom: 1px solid var(--border-color); */
}

.idly-gl .tab-content {
    overflow-y: scroll;
    max-height: 300px;
    padding: 3px;
}

.idly-gl .tab-content.tags {
    overflow-y: scroll;
    max-height: 300px;
    padding: unset;
}

.idly-gl .tags-box {
}

.idly-gl .tags-item {
    padding: 3px 0px;
    border-bottom: 1px solid var(--border-color);
}

.idly-gl .tab-row-active {
    border-bottom: 2px solid var(--highlight-primary);
}

.idly-gl .tab-row-item {
    line-height: 2em;
    cursor: pointer;
    font-weight: 400;
    font-size: 13px;
    color: var(--darkest-color);
}

.idly-gl .tab-row-item:hover {
    color: black;
}

.idly-gl .box {
    margin: 10px 6px 12px;
}

.idly-gl .layer-row {
    padding-left: 3px;
    margin: 3px 0px;
}

.idly-gl .layer-category {
    /* margin-top: 6px; */
}

.idly-gl .swatch {
    border: 1px solid var(--border-color);
    width: 12px;
    height: 12px;
    /* display: flex; */
    margin: 0px 5px;
    margin-bottom: 2px;
    align-self: center;
    border-radius: 2px;
}

.idly-gl .swatch.circular {
    border-radius: 10px;
}

.idly-gl .p3x {
    padding-left: 3px;
}

.idly-gl .entity-info {
    margin-left: 3px;
}

.idly-gl .tree {
    /* margin-left: 6px; */
}

.idly-gl .tree-item {
    /* border-bottom: 1px solid var(--border-color); */
    /* padding: 12px 12px; */
}

.idly-gl .tree-item-title {
    font-weight: 500;
}

.idly-gl .tree-label {
    font-weight: 500;
    padding-left: 3px;
}

/*******************************
            Flex Layout
  *******************************/
.idly-gl .layout.horizontal, .layout.horizontal-reverse, .layout.vertical, .layout.vertical-reverse {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}

.idly-gl .layout.inline {
    display: -ms-inline-flexbox;
    display: -webkit-inline-flex;
    display: inline-flex;
}

.idly-gl .layout.horizontal {
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;
}

.idly-gl .layout.horizontal-reverse {
    -ms-flex-direction: row-reverse;
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
}

.idly-gl .layout.vertical {
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    flex-direction: column;
}

.idly-gl .layout.vertical-reverse {
    -ms-flex-direction: column-reverse;
    -webkit-flex-direction: column-reverse;
    flex-direction: column-reverse;
}

.idly-gl .layout.wrap {
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
}

.idly-gl .layout.no-wrap {
    -ms-flex-wrap: nowrap;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
}

.idly-gl .layout.wrap-reverse {
    -ms-flex-wrap: wrap-reverse;
    -webkit-flex-wrap: wrap-reverse;
    flex-wrap: wrap-reverse;
}

.idly-gl .flex-auto {
    -ms-flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
}

.idly-gl .flex-none {
    -ms-flex: none;
    -webkit-flex: none;
    flex: none;
}

.idly-gl .flex, .flex-1 {
    -ms-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.idly-gl .flex-2 {
    -ms-flex: 2;
    -webkit-flex: 2;
    flex: 2;
}

.idly-gl .flex-3 {
    -ms-flex: 3;
    -webkit-flex: 3;
    flex: 3;
}

.idly-gl .flex-4 {
    -ms-flex: 4;
    -webkit-flex: 4;
    flex: 4;
}

.idly-gl .flex-5 {
    -ms-flex: 5;
    -webkit-flex: 5;
    flex: 5;
}

.idly-gl .flex-6 {
    -ms-flex: 6;
    -webkit-flex: 6;
    flex: 6;
}

.idly-gl .flex-7 {
    -ms-flex: 7;
    -webkit-flex: 7;
    flex: 7;
}

.idly-gl .flex-8 {
    -ms-flex: 8;
    -webkit-flex: 8;
    flex: 8;
}

.idly-gl .flex-9 {
    -ms-flex: 9;
    -webkit-flex: 9;
    flex: 9;
}

.idly-gl .flex-10 {
    -ms-flex: 10;
    -webkit-flex: 10;
    flex: 10;
}

.idly-gl .flex-11 {
    -ms-flex: 11;
    -webkit-flex: 11;
    flex: 11;
}

.idly-gl .flex-12 {
    -ms-flex: 12;
    -webkit-flex: 12;
    flex: 12;
}

/* alignment in cross axis */
.idly-gl .layout.start {
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
}

.idly-gl .layout.center, .layout.center-center {
    -ms-flex-align: center;
    -webkit-align-items: center;
    flex-grow: 3;
    align-items: center;
}

.idly-gl .layout.end {
    -ms-flex-align: end;
    -webkit-align-items: flex-end;
    align-items: flex-end;
}

/* alignment in main axis */
.idly-gl .layout.start-justified {
    -ms-flex-pack: start;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
}

.idly-gl .layout.center-justified, .layout.center-center {
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    /* max-width: 40px; */
}

.idly-gl .layout.end-justified {
    -ms-flex-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
}

.idly-gl .layout.around-justified {
    -ms-flex-pack: around;
    -webkit-justify-content: space-around;
    justify-content: space-around;
}

.idly-gl .layout.justified {
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
}

.idly-gl .idly-gl-icon {
    max-width: 18px;
    margin: 0 3px;
    cursor: pointer;
    font-weight: 500;
    color: var(--darkest-color);
}

.idly-gl .idly-gl-icon:hover {
    color: black;
}

.idly-gl .idly-gl-icon path:hover {
    fill: black !important;
}

.idly-gl .tree-row {
    cursor: default;
    padding-left: 3px;
}

.idly-gl .tree-row.unavailable {
    color: rgba(0,0,0,0.4);
}

.idly-gl .tree-row path {
    color: black
}

.idly-gl .tree-row.active {
    color: white;
    background-color: var(--highlight-primary);
}

.idly-gl .tree-row.active:hover {
    background-color: var(--highlight-primary);
}

.idly-gl .tree-row:hover {
    background-color: var(--highlight-secondary);
    border-radius: 2px;
}

/* self alignment */
.idly-gl .self-start {
    -ms-align-self: flex-start;
    -webkit-align-self: flex-start;
    align-self: flex-start;
}

.idly-gl .self-center {
    -ms-align-self: center;
    -webkit-align-self: center;
    align-self: center;
}

.idly-gl .self-end {
    -ms-align-self: flex-end;
    -webkit-align-self: flex-end;
    align-self: flex-end;
}

.idly-gl .self-stretch {
    -ms-align-self: stretch;
    -webkit-align-self: stretch;
    align-self: stretch;
}

/** loading*/
.idly-gl .loader, .loader:after {
    border-radius: 50%;
    width: 2em;
    height: 2em;
}

.idly-gl .loader {
    width: 10px;
    height: 10px;
    font-size: 4px;
    /* line-height: 123px; */
    text-indent: -9999em;
    border-top: 0.6em solid var(--darkest-color);
    border-right: 0.6em solid var(--darkest-color);
    border-bottom: 0.6em solid var(--darkest-color);
    border-left: 0.6em solid #ffffff;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: idly-gl-load8 1.1s infinite linear;
    animation: idly-gl-load8 1.1s infinite linear;
}

@-webkit-keyframes idly-gl-load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes idly-gl-load8 {
   0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

.idly-gl .svg-icon {
    width: 1.2em;
    height: 1.2em;
}

.idly-gl .svg-icon path, .svg-icon polygon, .svg-icon rect {
    fill: var(--darkest-color);
}

.idly-gl .svg-icon circle {
    stroke: var(--darkest-color);
    stroke-width: 1;
}
</style>
`;
