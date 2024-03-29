const tipoInstruccion = require('./arbol/instrucciones').TIPO_INSTRUCCION;
const tipoOperacion = require('./arbol/instrucciones').TIPO_OPERACION;
const tipoValor = require('./arbol/instrucciones').TIPO_VALOR;
const tipoDato = require('./arbol/tablasimbolos').TIPO_DATO;
const { exec } = require('child_process');

var fs = require('fs');

function graficarArbol(arbol){
    let number = 0;
    let str = "digraph G{\n" +
        "rankdir=TB\n" +
        "Nodo0[label=\"Arbol\"]\n";
    let arreglo = ejecutarbloque(arbol, number);
    number = arreglo[0];
    str += arreglo[1];
    str += "}";
    fs.writeFile('./arbol.dot', str,  function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    exec('dot -Tpng arbol.dot -o arbol.png', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log(`Se logro compilar la imagen`);
    });
}


function ejecutarbloque(instrucciones, number){
    let str = "";
    let pivote = number;
    instrucciones.forEach((instruccion)=>{
        number += 1;
        if(instruccion.tipo === tipoInstruccion.DECLARACION){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejdeclaracion(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.IMPRIMIR){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejimprimir(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.ASIGNACION){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejasignacion(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.ADICION){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejAdicion(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.SUSTRACCION){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejSustraccion(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.WHILE){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejwhile(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.BLOQUEIF){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejif(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.DOWHILE){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejDowhile(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.FOR){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejfor(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.SWTICH){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejSwitch(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.LLAMADA){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejLlamado(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.EXC){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejExec(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.METODO){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejMetodo(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.FUNCION){
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejFuncion(instruccion, number);
            number = arreglo[0];
            str += arreglo[1];
        }
        else if(instruccion.tipo === tipoInstruccion.BREAK){
            str += "Nodo" + number.toString() + "[label=\"Return\"]\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        }
        else if(instruccion.tipo === tipoInstruccion.CONTINUE){
            str += "Nodo" + number.toString() + "[label=\"Break\"]\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        }
        else if(instruccion.tipo === tipoInstruccion.RETURN){
            if(instruccion.exp === undefined){
                str += "Nodo" + number.toString() + "[label=\"Return\"]\n";
                str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            }else{
                str += "Nodo" + number.toString() + "[label=\"Return\"]\n";
                str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
                let pivote2 = pivote + 1;
                number += 1;
                str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
                let lista = procesarexp(instruccion.exp, number);
                number = lista[0];
                str += lista[1];
            }
        }
    });
    return [number, str];
}

function ejdeclaracion(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Declaracion";
    if (instruccion.expresion === undefined){
        str += " Indefinida\"]\n";
        number += 1;
        str += "Nodo" + number.toString() + "[label =\"Tipo: ";
        let dato = regresarDato(instruccion.tipo_dato1);
        str += dato;
        str += "\nNodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        number +=1;
        str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    }else{
        str += " Definida\"]\n";
        number += 1;
        str += "Nodo" + number.toString() + "[label =\"Tipo Dato: ";
        let dato = regresarDato(instruccion.tipo_dato1);
        str += dato;
        str += "\nNodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        number +=1;
        str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        number +=1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let arreglo = procesarexp(instruccion.expresion, number);
        number = arreglo[0];
        str += arreglo[1];
    }
    return [number, str];
}

function regresarDato(tipo){
    let str ="";
    switch(tipo){
        case tipoDato.ENTERO:
            str += " Int\"]";
            break;
        case tipoDato.DOUBLE:
            str += " Double\"]";
            break;
        case tipoDato.BOOL:
            str += " Boolean\"]";
            break;
        case tipoDato.CHAR:
            str += " Char\"]";
            break;
        case tipoDato.STRING:
            str += " String\"]";
            break;
    }
    return str;
}

function ejasignacion(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Asignacion\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    number +=1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = procesarexp(instruccion.expresion, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejAdicion(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Adicion\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + " ++\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    return [number, str];
}

function ejSustraccion(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Sustraccion\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "--\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    return [number, str];
}

function ejimprimir(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Print\"]\n";
    number += 1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = procesarexp(instruccion.expresion, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejwhile(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + pivote.toString() + "[label =\"While\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Condicion\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    pivote +=1;
    number += 1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = procesarexp(instruccion.condicion, number);
    number = arreglo[0];
    str += arreglo[1];
    number += 1;
    pivote -=1;
    str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    arreglo = ejecutarbloque(instruccion.instrucciones, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejif(instruccion1, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + pivote.toString() + "[label =\"Bloque If\"]\n";
    let instrucciones = instruccion1.instrucciones;
    instrucciones.forEach((instruccion)=>{
        number += 1;
        if (instruccion.tipo === tipoInstruccion.IF){
            let pivote2 = number;
            str += "Nodo" + pivote2.toString() + "[label =\"If/ If-Else\"]\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + pivote2.toString() + ";\n";
            number += 1;
            str += "Nodo" + number.toString() + "[label =\"Condicion\"]";
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            number += 1;
            pivote2 +=1;
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = procesarexp(instruccion.condicion, number);
            number = arreglo[0];
            str += arreglo[1];
            number += 1;
            pivote2 -=1;
            str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            arreglo = ejecutarbloque(instruccion.instrucciones, number);
            number = arreglo[0];
            str += arreglo[1];
        }else if (instruccion.tipo === tipoInstruccion.ELSE){
            let pivote2 = number;
            str += "Nodo" + pivote2.toString() + "[label =\"Else\"]\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + pivote2.toString() + ";\n";
            number += 1;
            str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejecutarbloque(instruccion.instrucciones, number);
            number = arreglo[0];
            str += arreglo[1];
        }
    });
    return [number, str];
}

function ejDowhile(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + pivote.toString() + "[label =\"Do-While\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Condicion\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    pivote +=1;
    number += 1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = procesarexp(instruccion.condicion, number);
    number = arreglo[0];
    str += arreglo[1];
    number += 1;
    pivote -=1;
    str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    arreglo = ejecutarbloque(instruccion.instrucciones, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejfor(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + pivote.toString() + "[label =\"For\"]\n";
    let asig = [instruccion.asignacion1];
    let arreglo = ejecutarbloque(asig, number);
    number = arreglo[0];
    str += arreglo[1];
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Condicion\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let pivote2 = number;
    number += 1;
    str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
    arreglo = procesarexp(instruccion.condicion, number);
    number = arreglo[0];
    str += arreglo[1];
    number += 1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    if(instruccion.asignacion2.tipo === tipoInstruccion.ASIGNACION){
        arreglo = ejasignacion(instruccion.asignacion2, number);
    }else if(instruccion.asignacion2.tipo === tipoInstruccion.ADICION){
        arreglo = ejAdicion(instruccion.asignacion2, number);
    } else if(instruccion.asignacion2.tipo === tipoInstruccion.SUSTRACCION){
        arreglo = ejSustraccion(instruccion.asignacion2, number);
    }
    number = arreglo[0];
    str += arreglo[1];
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    arreglo = ejecutarbloque(instruccion.instrucciones, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejSwitch(instruccion1, number){
    let instrucciones = instruccion1.instrucciones;
    let condicionGeneral = instruccion1.condicion;
    let str = "";
    let pivote = number;
    str += "Nodo" + pivote.toString() + "[label =\"Switch\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Condicion\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    pivote +=1;
    number += 1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = procesarexp(condicionGeneral, number);
    number = arreglo[0];
    str += arreglo[1];
    pivote -=1;
    instrucciones.forEach((instruccion)=>{
        number += 1;
        if (instruccion.tipo === tipoInstruccion.CASE){
            let pivote2 = number;
            str += "Nodo" + pivote2.toString() + "[label =\"Case\"]\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + pivote2.toString() + ";\n";
            number += 1;
            str += "Nodo" + number.toString() + "[label =\"Condicion\"]\n";
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            number += 1;
            pivote2 +=1;
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = procesarexp(instruccion.condicion, number);
            number = arreglo[0];
            str += arreglo[1];
            number += 1;
            pivote2 -=1;
            str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            arreglo = ejecutarbloque(instruccion.instrucciones, number);
            number = arreglo[0];
            str += arreglo[1];
        }else if (instruccion.tipo === tipoInstruccion.DEFAULT){
            let pivote2 = number;
            str += "Nodo" + pivote2.toString() + "[label =\"Default\"]\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + pivote2.toString() + ";\n";
            number += 1;
            str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
            str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = ejecutarbloque(instruccion.instrucciones, number);
            number = arreglo[0];
            str += arreglo[1];
        }
    });
    return [number, str];
}

function ejMetodo(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Metodo\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    number +=1;
    if(instruccion.parametros.length > 0) {
        str += "Nodo" + number.toString() + "[label =\"Parametros\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        pivote += 2;
        number += 1;
        instruccion.parametros.forEach((parametro) => {
            str += "Nodo" + number.toString() + "[label =\"id= " + parametro.id +", tipo:" + regresarDato(parametro.tipo) + "\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            number += 1;
        });
        pivote-=2;
    }
    str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = ejecutarbloque(instruccion.instrucciones, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejFuncion(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Funcion\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Tipo: ";
    let dato = regresarDato(instruccion.tipoDato);
    str += dato;
    str += "\nNodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    number +=1;
    if(instruccion.parametros.length > 0) {
        str += "Nodo" + number.toString() + "[label =\"Parametros\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        pivote += 2;
        number += 1;
        instruccion.parametros.forEach((parametro) => {
            str += "Nodo" + number.toString() + "[label =\"id= " + parametro.id +", tipo:" + regresarDato(parametro.tipo) + "\n";
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            number += 1;
        });
        pivote-=2;
    }
    str += "Nodo" + number.toString() + "[label =\"Instrucciones\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = ejecutarbloque(instruccion.instrucciones, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function ejLlamado(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Llamado\"]\n";
    number += 1;
    str += "Nodo" + number.toString() + "[label =\"Id: " + instruccion.id + "\"]\n";
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    number +=1;
    if(instruccion.expresiones.length > 0) {
        str += "Nodo" + number.toString() + "[label =\"Parametros\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        pivote += 2;
        number += 1;
        instruccion.expresiones.forEach((expresion) => {
            str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
            let arreglo = procesarexp(expresion, number);
            number = arreglo[0];
            str += arreglo[1];
            number += 1;
        });
    }
    return [number, str];
}

function ejExec(instruccion, number){
    let str = "";
    let pivote = number;
    str += "Nodo" + number.toString() + "[label =\"Exec\"]\n";
    number +=1;
    str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
    let arreglo = ejLlamado(instruccion.metodo, number);
    number = arreglo[0];
    str += arreglo[1];
    return [number, str];
}

function procesarexp(expresion, number){
    let str ="";
    let pivote = number;
    if(expresion.tipo === tipoInstruccion.LLAMADA){
        let valores = ejLlamado(expresion, number);
        number = valores[0];
        str += valores[1];
    }
    else if(expresion.tipo === tipoInstruccion.LOWER){
        str += "Nodo" + number.toString() + "[label=\"ToLower\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.UPPER){
        str += "Nodo" + number.toString() + "[label=\"ToUpper\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.LENG){
        str += "Nodo" + number.toString() + "[label=\"Lenght\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.TRUNC){
        str += "Nodo" + number.toString() + "[label=\"Truncate\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.INROUND){
        str += "Nodo" + number.toString() + "[label=\"Round\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.TYPE){
        str += "Nodo" + number.toString() + "[label=\"TypeOf\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.TOSTRING){
        str += "Nodo" + number.toString() + "[label=\"ToString\"]\n";
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.expresion, number);
        number = lista[0];
        str += lista[1];
    }
    else if(expresion.tipo === tipoInstruccion.TERNARIO){
        str += "Nodo" + number.toString() + "[label=\"Ternario\"]\n";
        number += 1;
        str += "Nodo" + number.toString() + "[label=\"Condicion\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let pivote2 = number;
        number += 1;
        str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
        let lista = procesarexp(expresion.condicion, number);
        number = lista[0];
        str += lista[1];
        number += 1;
        str += "Nodo" + number.toString() + "[label=\"Expresion Verdadero\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        pivote2 = number;
        number += 1;
        str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
        lista = procesarexp(expresion.exp1, number);
        number = lista[0];
        str += lista[1];
        number += 1;
        str += "Nodo" + number.toString() + "[label=\"Expresion False\"]\n";
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        pivote2 = number;
        number += 1;
        str += "Nodo" + pivote2.toString() + "->Nodo" + number.toString() + ";\n";
        lista = procesarexp(expresion.exp2, number);
        number = lista[0];
        str += lista[1];
    }
    else{
        str += "Nodo" + pivote.toString() + "[label =\"" + procesarDato(expresion) + "\"]\n";
    }
    if(expresion.operandoIzq !== undefined){
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let arreglo = procesarexp(expresion.operandoIzq, number);
        number = arreglo[0];
        str += arreglo[1];
    }
    if(expresion.operandoDer !== undefined){
        number += 1;
        str += "Nodo" + pivote.toString() + "->Nodo" + number.toString() + ";\n";
        let arreglo = procesarexp(expresion.operandoDer, number);
        number = arreglo[0];
        str += arreglo[1];
    }
    return [number, str];
}

function procesarDato(expresion){
    //console.log(expresion);
    switch(expresion.tipo){
        case tipoValor.ENTERO:
            return expresion.valor.toString();
        case tipoValor.DOUBLE:
            return expresion.valor.toString();
        case tipoValor.BOOL:
            return expresion.valor;
        case tipoValor.CHAR:
            return expresion.valor;
        case tipoValor.STRING:
            return expresion.valor;
        case tipoValor.IDENTIFICADOR:
            return expresion.valor;
        case tipoOperacion.SUMA:
            return "+";
        case tipoOperacion.RESTA:
            return "-";
        case tipoOperacion.MULTIPLICACION:
            return "*";
        case tipoOperacion.DIVISION:
            return "/";
        case tipoOperacion.POTENCIA:
            return "^";
        case tipoOperacion.MODULO:
            return "%";
        case tipoOperacion.NEGATIVO:
            return "-";
        case tipoOperacion.ADICION:
            return "++";
        case tipoOperacion.SUSTRACCION:
            return "--";
        case tipoOperacion.IGUALDAD:
            return "==";
        case tipoOperacion.DIFERENTE:
            return "!=";
        case tipoOperacion.MENOR:
            return "<";
        case tipoOperacion.MENORIGUAL:
            return "<=";
        case tipoOperacion.MAYOR:
            return ">";
        case tipoOperacion.MAYORIGUAL:
            return ">=";
        case tipoOperacion.OR:
            return "||";
        case tipoOperacion.AND:
            return "&&";
        case tipoOperacion.NOT:
            return "!";
    }
}

module.exports.graficarArbol = graficarArbol;