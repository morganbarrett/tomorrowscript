//in tommorrow script version Stream class would be an explicit compile time transformation
//would allow for converion overloads so charstream could be used from string just by changing type, no map needed
export default class Stream<T> {
	public consumed: T[] = [];

	constructor(public arr: T[]){}

	get done(){
		return !this.arr.length;
	}

	get next(){
		return this.arr[0];
	}

	is(options: Iterable<T>){
		return !this.done && [...options].includes(this.next);
	}

	lookAhead(match: Iterable<T>){
		return [...match].every((value, i) => this.arr[i] === value);
	}

	shift(){
		let next = this.arr.shift();
		if(!this.done) this.consumed.push(next as T);
		return next;
	}

	unshift(...values: T[]){
		this.arr.unshift(...values);
	}

	delete(i = 1){
		this.consumed.splice(-i);
	}

	seen(...values: T[]){
		this.consumed.push(...values);
	}

	take(fn: (value: T, last: T | null) => boolean | undefined): T[] {
		let arr = [];
		let last: T | null = null;
		while(!this.done && fn(this.next, last)){
			last = this.shift()!;
			arr.push(last);
		}
		return arr;
	}

	takeIn(options: Iterable<T>): T[] {
		return this.take(() => this.is(options));
	}

	takeNotIn(options: Iterable<T>): T[] {
		return this.take(() => !this.is(options));
	}
}
