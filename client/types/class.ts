export interface Teacher {
	id: string;
	name: string;
}

export interface Class {
	id: number;
	name: string;
	teacherId: string;
	tuitionFee: number;
}
