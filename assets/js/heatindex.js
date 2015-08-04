function heatindex(T, R) {
    if( T < 70.0 ) {
        return;
    }

    if( R < 0.0 || R > 100.0 ) {
        return;
    }

    var hi = parseFloat( "0.0" );
    var T2 = T*T;
    var T3 = T2*T;
    var R2 = R*R;
    var R3 = R2*R;

    var c00 = parseFloat( "16.923" );
    var c01 = parseFloat( "1.85212E-1" );
    var c02 = parseFloat( "5.37941" );
    var c03 = parseFloat( "1.00254E-1" );
    var c04 = parseFloat( "9.41695E-3" );
    var c05 = parseFloat( "7.28898E-3" );
    var c06 = parseFloat( "3.45372E-4" );
    var c07 = parseFloat( "8.14971E-4" );
    var c08 = parseFloat( "1.02102E-5" );
    var c09 = parseFloat( "3.8646E-5" );
    var c10 = parseFloat( "2.91583E-5" );
    var c11 = parseFloat( "1.42721E-6" );
    var c12 = parseFloat( "1.97483E-7" );
    var c13 = parseFloat( "2.18429E-8" );
    var c14 = parseFloat( "8.43296E-10" );
    var c15 = parseFloat( "4.81975E-11" );

    hi = c00;
    hi += (c01 * T);
    hi += (c02 * R);
    hi -= (c03 * T * R);
    hi += (c04 * T2);
    hi += (c05 * R2);
    hi += (c06 * T2 * R);
    hi -= (c07 * T * R2);
    hi += (c08 * T2 * R2);
    hi -= (c09 * T3);
    hi += (c10 * R3);
    hi += (c11 * T3 * R);
    hi += (c12 * T * R3);
    hi -= (c13 * T3 * R2);
    hi += (c14 * T2 * R3);
    hi -= (c15 * T3 * R3);

    return Math.round( 10*hi ) / 10;
}

function celcius_from_fahrenheit(f) {
    return (f - 32) / 1.8;
}

function fahrenheit_from_celcius(c)
{
  return (c * 1.8) + 32;
}

function chillindex(t, v) {
    return 35.74 + 0.6215 * t - 35.75 * Math.pow(v, 0.16) + 0.4275 * t * Math.pow(v, 0.16);
}