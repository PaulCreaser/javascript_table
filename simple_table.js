/**
* Simple Dynamic Table
*/
function simple_table(doc, id)
{
	this.doc    = doc;
	this.div    = doc.getElementById(id)
	this.table  = doc.createElement("table");

	this.header=null;
	this.body=null;
	this.has_header=0;

	this.id = id;

	this.div.appendChild(this.table);
	this.lookup = {};
	this.create_header();
	this.create_body();
}

simple_table.prototype.search = function(key)
{
	if (key in this.lookup)
	{
		return this.lookup[key];
	} else
	{
		return -1;
	}
}

simple_table.prototype.add_cell = function(row, col_no, data)
{
    	var cell = row.insertCell(col_no);
    	var text = this.doc.createTextNode(data);
	cell.setAttribute('data-id', data);
    	cell.appendChild(text);
}

simple_table.prototype.update_cell = function(row, col_no, data)
{
	var cell = row.cells[col_no];
	cell.setAttribute('data-id', data);
	cell.innerHTML=data;
}


simple_table.prototype.create_header = function()
{
	this.header = this.table.createTHead();
}

simple_table.prototype.create_body = function()
{
	this.body = this.table.createTBody();
}

simple_table.prototype.add_header = function(header_array) 
{
	var row 	= this.header.insertRow(0);    

	var index 	= 0;
	for (index=0 ; index < header_array.length; index++)
	{
    		var title = header_array[index];
		this.add_cell(row, index, title)
    	}
}

simple_table.prototype.update_header = function(header_array) 
{
	var row 	= this.header.rows[0];
	var index 	= 0;
	for (index=0 ; index < header_array.length; index++)
	{
    		var title = header_array[index];
		this.update_cell(row, index, title)
    	}
}

simple_table.prototype.add_row = function(key, data_array) 
{
    	var rowCount	= this.body.rows.length;
    	var row		= this.body.insertRow(rowCount);

	var cols 	= this.header.rows[0].cells.length;

	var data_len	= data_array.length;

	var index 	= 0;

	this.lookup[key] = row;
	row.setAttribute('data-id', key);

	for (index=0 ; index < Math.min(cols, data_len); index++)
	{
    		var data = data_array[index];
		this.add_cell(row, index, data)
    	}
}

simple_table.prototype.delete_row  = function(key)
{
	var row = this.search(key); 
       	if ( row != -1)
	{
		var row_no = row.rowIndex;
		this.body.deleteRow(row_no);
		delete this.lookup[key];
	}
}

simple_table.prototype.update_row =  function(row, data_array) 
{
	var cols 	= this.header.rows[0].cells.length;
	var data_len	= data_array.length;

	for (index=0 ; index < Math.min(cols, data_len); index++)
	{
    		var data = data_array[index];
		this.update_cell(row, index, data)
    	}
}

simple_table.prototype.update = function(message)
{
	var parsed_data	= JSON.parse(message);

	if ( parsed_data.type == "simple_table_data")
	{
    		var data_list 	= parsed_data.list;

    		for (var i = 0; i < data_list.length; i++)
    		{
    			var data = data_list[i];
			var key = data[0];
        		var row = this.search(key); 

			if (this.has_header == 1)
			{
				this.update_header(data);
			}
			else
			{
				this.add_header(data);
				this.has_header = 1;
			}

        	 	if ( row != -1)
        		{
				this.update_row(row, data);
        		} else
			{
				this.add_row(key, data);
			}
		}
	}
	else if ( parsed_data.type == "simple_table_title")
	{
    		var data = parsed_data.header;
		if (this.has_header == 1)
		{
			this.update_header(data);
		}
		else
		{
			this.add_header(data);
			this.has_header = 1;
		}
	}
	else if ( parsed_data.type == "simple_table_delete")
	{
	}
}
