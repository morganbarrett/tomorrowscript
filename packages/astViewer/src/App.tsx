import {Component} from "react";
import Parser from "tms-parser";
import {Node, Block} from "tms-nodes";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const renderNode = (label: string, node: Node, state: {i: number}) =>
	<TreeItem key={state.i} nodeId={`${state.i++}`} label={`${label}: ${Object.getPrototypeOf(node).constructor.name}`}>
		{Object.entries(Object.getOwnPropertyDescriptors(node)).map(([name, {value}]) =>
			value && typeof value == "object" ? renderNode(name, value, state) :
			<TreeItem key={state.i} nodeId={`${state.i++}`} label={`${name} = ${value}`} />
		)}
	</TreeItem>;

const renderTree = (block: Block | null, state = {i: 0}) =>
	block && block.arr.map((node, i) => renderNode(`${i}`, node, state));

interface AppProps {

}

interface AppState {
	ast: Block | null,
	err: string | null
}

export default class App extends Component<AppProps, AppState> {
	constructor(props: AppProps){
		super(props);

		this.state = {
			ast: null,
			err: null
		};
	}

	update = (code = "") => {
		try {
			this.setState({ast: new Parser(code).parseAll(), err: null});
		} catch (e){
			this.setState({err: `${e}`});
		}
	}

	render() {
		return <Grid container>
			<Grid item xs={6}>
				<Editor
					height="90vh"
					defaultLanguage="typescript"
					defaultValue=""
					onChange={this.update}
				/>
			</Grid>

			<Grid item xs={6}>
				{this.state.err ? this.state.err :
					<TreeView
						aria-label="file system navigator"
						defaultCollapseIcon={<ExpandMoreIcon/>}
						defaultExpandIcon={<ChevronRightIcon/>}
					>{renderTree(this.state.ast)}</TreeView>
				}
			</Grid>
		</Grid>;
	}
}
