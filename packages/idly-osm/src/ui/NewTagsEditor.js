"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function getTags(shrub) {
    if (!shrub)
        return {};
    var ids = shrub.toObject().knownIds;
    if (ids.length === 0) {
        return {};
    }
    var leaf = shrub.getLeaf(ids[0]);
    if (!leaf)
        return {};
    return leaf.getEntity().tags;
}
function getEntity(shrub) {
    if (!shrub)
        return;
    var leaf = shrub.getLeaves()[0];
    if (!leaf) {
        return;
    }
    var entity = leaf.getEntity();
    return entity;
}
var NewTagsEditor = /** @class */ (function (_super) {
    __extends(NewTagsEditor, _super);
    function NewTagsEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            tags: getTags(_this.props.idlyState.core.selectedShrub)
        };
        _this.handleChange = function (event) {
            var tags = event.target.value.split('\n').map(function (t) { return t.split('='); });
            _this.setState({ tags: tags });
        };
        _this.handleSubmit = function (event) {
            // const t = tagsFactory(this.state.tags);
            // const en = modifyEntity(
            //   getEntity(this.props.idlyState.core.selectedShrub),
            //   {
            //     tags: t
            //   }
            // );
            var leaf = _this.props.idlyState.core.selectedShrub.getLeaves()[0];
            if (!leaf)
                return;
            // const {} = s
            // this.props.selectCommitAction(
            // //  Shrub.create() shrub.replace(en),
            //   this.props.idlyState.core.featureTable
            // );
            // event.preventDefault();
        };
        return _this;
    }
    NewTagsEditor.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState({
            tags: getTags(nextProps.idlyState.core.selectedShrub)
        });
    };
    NewTagsEditor.prototype.render = function () {
        var _this = this;
        return (<form onSubmit={this.handleSubmit}>
        <textarea style={{ fontSize: 24 }} value={Object.keys(this.state.tags)
            .map(function (t) { return t + "=" + _this.state.tags[t]; })
            .join('\n')} onChange={this.handleChange} rows={Object.keys(this.state.tags).length + 4}/>
        <input type="submit" value="Submit"/>
      </form>);
    };
    return NewTagsEditor;
}(React.PureComponent));
exports.NewTagsEditor = NewTagsEditor;
