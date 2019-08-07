class Animal extends egret.Bitmap{
	public constructor(name:string, type:string, coordinate:Coordinate) {
		super();
		this.name = name;
		this.type = type;
		this.coordinate = coordinate;
	}
	private coordinate:Coordinate;

	public setCoordinate(coordinate:Coordinate) {
		this.coordinate = coordinate;
	}
	public getCoordinate():Coordinate {
		return this.coordinate;
	}
	
	private type:string;

	public setType(type:string) {
		this.type = type;
	}

	public getType():string {
		return this.type;
	}

	private live:boolean = true;
	public setLive(live:boolean) {
		this.live = live;
	}

	public getLive():boolean {
		return this.live;
	}
}