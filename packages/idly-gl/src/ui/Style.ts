import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';

export const Style = ``;
export const style: TemplateResult = html`
<style>
.container {
    --bg-dark-color: #f3f3f3; --border-color: #cccccc; --darkest-color: #777; background-color: white;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    /* max-height: 300px; */
    min-width: 200px;
    max-width: 280px;
}

.dark-bg {
    background-color: var(--bg-dark-color);
}

.tab-row {
    display: flex;
    height:25px;
    background-color: var(--bg-dark-color);
    border-bottom: 1px solid var(--border-color);
    /* padding: 2px 2px 0 2px; */
}

.icon-row {
    display: flex;
    height:25px;
    background-color: var(--bg-dark-color);
    border-bottom: 1px solid var(--border-color);
}

.tab-content {
    overflow-y: scroll;
    max-height: 300px;
}

.tags-box {
}

.tab-row-active {
    border-bottom: 2px solid #1da1f2;
}
.tab-row-item {
    line-height: 2em;
}

.tags-box .tags-item {
    border-bottom: 1px solid var(--border-color);
    padding: 10px 5px;
}

.tags-item .tags-key {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-weight: 500;
}

.tags-item .tags-value {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
}

.box {
    margin: 10px 6px 12px;
}

.box .title {
    background-color: #ebedf0;
    margin: 5px;
}

/*******************************
            Flex Layout
  *******************************/
.layout.horizontal, .layout.horizontal-reverse, .layout.vertical, .layout.vertical-reverse {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}

.layout.inline {
    display: -ms-inline-flexbox;
    display: -webkit-inline-flex;
    display: inline-flex;
}

.layout.horizontal {
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;
}

.layout.horizontal-reverse {
    -ms-flex-direction: row-reverse;
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
}

.layout.vertical {
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    flex-direction: column;
}

.layout.vertical-reverse {
    -ms-flex-direction: column-reverse;
    -webkit-flex-direction: column-reverse;
    flex-direction: column-reverse;
}

.layout.wrap {
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
}

.layout.no-wrap {
    -ms-flex-wrap: nowrap;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
}

.layout.wrap-reverse {
    -ms-flex-wrap: wrap-reverse;
    -webkit-flex-wrap: wrap-reverse;
    flex-wrap: wrap-reverse;
}

.flex-auto {
    -ms-flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
}

.flex-none {
    -ms-flex: none;
    -webkit-flex: none;
    flex: none;
}

.flex, .flex-1 {
    -ms-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.flex-2 {
    -ms-flex: 2;
    -webkit-flex: 2;
    flex: 2;
}

.flex-3 {
    -ms-flex: 3;
    -webkit-flex: 3;
    flex: 3;
}

.flex-4 {
    -ms-flex: 4;
    -webkit-flex: 4;
    flex: 4;
}

.flex-5 {
    -ms-flex: 5;
    -webkit-flex: 5;
    flex: 5;
}

.flex-6 {
    -ms-flex: 6;
    -webkit-flex: 6;
    flex: 6;
}

.flex-7 {
    -ms-flex: 7;
    -webkit-flex: 7;
    flex: 7;
}

.flex-8 {
    -ms-flex: 8;
    -webkit-flex: 8;
    flex: 8;
}

.flex-9 {
    -ms-flex: 9;
    -webkit-flex: 9;
    flex: 9;
}

.flex-10 {
    -ms-flex: 10;
    -webkit-flex: 10;
    flex: 10;
}

.flex-11 {
    -ms-flex: 11;
    -webkit-flex: 11;
    flex: 11;
}

.flex-12 {
    -ms-flex: 12;
    -webkit-flex: 12;
    flex: 12;
}

/* alignment in cross axis */
.layout.start {
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
}

.layout.center, .layout.center-center {
    -ms-flex-align: center;
    -webkit-align-items: center;
    flex-grow: 3;
    align-items: center;
}

.layout.end {
    -ms-flex-align: end;
    -webkit-align-items: flex-end;
    align-items: flex-end;
}

/* alignment in main axis */
.layout.start-justified {
    -ms-flex-pack: start;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
}

.layout.center-justified, .layout.center-center {
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
}

.layout.end-justified {
    -ms-flex-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
}

.layout.around-justified {
    -ms-flex-pack: around;
    -webkit-justify-content: space-around;
    justify-content: space-around;
}

.layout.justified {
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
}

/* self alignment */
.self-start {
    -ms-align-self: flex-start;
    -webkit-align-self: flex-start;
    align-self: flex-start;
}

.self-center {
    -ms-align-self: center;
    -webkit-align-self: center;
    align-self: center;
}

.self-end {
    -ms-align-self: flex-end;
    -webkit-align-self: flex-end;
    align-self: flex-end;
}

.self-stretch {
    -ms-align-self: stretch;
    -webkit-align-self: stretch;
    align-self: stretch;
}

/** loading*/
.loader, .loader:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
}

.loader {
    width: 10px;
    height: 10px;
    font-size: 5px;
    position: relative;
    text-indent: -9999em;
    border-top: 0.6em solid var(--darkest-color);
    border-right: 0.6em solid var(--darkest-color);
    border-bottom: 0.6em solid var(--darkest-color);
    border-left: 0.6em solid #ffffff;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
}

@-webkit-keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

.svg-icon {
  width: 1.2em;
  height: 1.2em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: var(--darkest-color);
}

.svg-icon circle {
  stroke: var(--darkest-color);
  stroke-width: 1;
}
</style>
`;
